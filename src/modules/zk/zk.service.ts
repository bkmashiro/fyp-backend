// src/zk/zk.service.ts
import { Injectable, Logger } from '@nestjs/common'
import { groth16 } from 'snarkjs'
import * as fs from 'fs'
import { ed25519 } from '@noble/curves/ed25519'
import { ZKUtils } from './zk.utils'
import { CreateArtworkProofDto, VerifyArtworkOwnershipDto } from './dto/zk.dto'
import { ethers } from 'ethers'
import { ArtworkProof } from './types/zk.types'
import { HederaService } from '../consensus/hedera/hedera.service'
import { TopicType } from '../consensus/types/topic-type.enum'
import * as path from 'path'
import * as os from 'os'

@Injectable()
export class ZkService {
  private readonly logger = new Logger(ZkService.name)
  private readonly keyPairs: Map<
    string,
    { privateKey: string; publicKey: string; address: string }
  > = new Map()

  constructor(private readonly hederaService: HederaService) {
    // setTimeout(() => {
    //   this.generateTestData()
    // }, 3000)
  }

  private async generateTestData() {
    try {
      // 生成测试钱包
      const wallet = ethers.Wallet.createRandom()

      // 生成测试艺术品数据
      const artworkData = 'Test Artwork #1'
      const artworkHash = ethers.keccak256(ethers.toUtf8Bytes(artworkData))

      // 签名
      const signature = await wallet.signMessage(artworkHash)

      // 打印测试数据
      console.log('\n=== 测试数据 ===')
      console.log('艺术品数据:', artworkData)
      console.log('艺术品哈希:', artworkHash)
      console.log('签名:', signature)
      console.log('钱包地址:', wallet.address)
      console.log('私钥:', wallet.privateKey)
      console.log('=== 测试数据 ===\n')

      // 创建测试证明
      const dto: CreateArtworkProofDto = {
        artworkHash,
        signature,
        // 使用默认值：nonce 和 ttl 都不提供
      }
      await this.createArtworkProof(dto)

      // 验证测试证明
      const verifyDto: VerifyArtworkOwnershipDto = {
        artworkHash,
        ownerAddress: wallet.address,
      }
      const result = await this.verifyArtworkOwnership(verifyDto)
      console.log('验证结果:', result)
    } catch (error) {
      this.logger.error('生成测试数据失败', error.stack)
    }
  }

  async test() {
    try {
      const privKey = ed25519.utils.randomPrivateKey()
      const pubKey = ed25519.getPublicKey(privKey)
      const message = 'Hello, World!'
      const messageBytes = new TextEncoder().encode(message)
      const sig = ed25519.sign(messageBytes, privKey)

      console.log({
        privKeyHex: Buffer.from(privKey).toString('hex'),
        pubKeyHex: Buffer.from(pubKey).toString('hex'),
        message,
        signatureHex: Buffer.from(sig).toString('hex'),
      })
    } catch (error) {
      console.error('测试失败:', error)
    }
  }

  async generateProof(input: any) {
    try {
      this.logger.log('Generating ZK proof...')
      const { proof, publicSignals } = await ZKUtils.generateZKProof(input)
      this.logger.log('ZK proof generated successfully')
      return { proof, publicSignals }
    } catch (error) {
      this.logger.error('Failed to generate ZK proof', error.stack)
      throw new Error('Failed to generate ZK proof')
    }
  }

  async verifyProof(proof: any, publicSignals: any[]) {
    try {
      this.logger.log('Verifying ZK proof...')
      const isValid = await ZKUtils.verifyProof(proof, publicSignals)
      this.logger.log(`ZK proof verification result: ${isValid}`)
      return isValid
    } catch (error) {
      this.logger.error('Failed to verify ZK proof', error.stack)
      throw new Error('Failed to verify ZK proof')
    }
  }

  async testSignature(message: string) {
    try {
      this.logger.log('Testing signature...')
      const { privateKey, publicKey } = ZKUtils.generateKeyPair()
      const signature = await ZKUtils.signMessage(message, privateKey)
      const isValid = ZKUtils.verifySignature(message, signature, publicKey)
      this.logger.log(`Signature test result: ${isValid}`)
      return { isValid, signature, publicKey }
    } catch (error) {
      this.logger.error('Failed to test signature', error.stack)
      throw new Error('Failed to test signature')
    }
  }

  async createArtworkProof(dto: CreateArtworkProofDto) {
    try {
      this.logger.log('Creating artwork proof...')

      const ownerAddress = ethers.verifyMessage(dto.artworkHash, dto.signature)
      
      // 使用 TTL 计算有效期时间戳，默认14天
      const currentTime = Math.floor(Date.now() / 1000)
      const ttl = dto.ttl || 14 * 24 * 3600 // 默认14天
      const validUntil = currentTime + ttl

      // 生成默认 nonce（如果未提供）
      const nonce = dto.nonce || ethers.hexlify(ethers.randomBytes(32))

      const { proof, publicSignals } = await ZKUtils.generateZKProof({
        sigHash: dto.signature,
        artHash: dto.artworkHash,
        nonce,
        validUntil: validUntil.toString(),
        currentTime: currentTime.toString()
      })

      // 上链存证
      await this.hederaService.submitToChain(TopicType.ARTWORK, {
        proof,
        publicSignals,
        artworkHash: dto.artworkHash,
        pubKeyHash: ownerAddress,
        validUntil
      })

      return {
        proof,
        publicSignals,
        ownerAddress,
        validUntil,
        nonce
      }
    } catch (error) {
      this.logger.error('Failed to create artwork proof', error.stack)
      throw new Error('Failed to create artwork proof')
    }
  }

  async verifyArtworkOwnership(dto: VerifyArtworkOwnershipDto) {
    try {
      this.logger.log('Verifying artwork ownership...')
      
      let onChainRecord: any = null
      let recordType: 'zk' | 'traditional' = 'traditional'
      let hasOnChainRecord: boolean | 'unknown' = false
      
      // 根据提供的参数选择验证模式
      if (dto.onChainRecord) {
        // 零知识模式：直接使用用户提供的链上记录
        onChainRecord = dto.onChainRecord
        recordType = 'zk'
        hasOnChainRecord = 'unknown' // 零知识模式下不知道是否在链上
        this.logger.debug(
          'Using zero-knowledge mode with provided on-chain record',
        )
      } else if (dto.artworkHash) {
        // 传统模式：从区块链查找记录
        const rawRecord = await this.hederaService.findRecord(TopicType.ARTWORK, {
          artworkHash: dto.artworkHash,
        })

        console.log('rawRecord', rawRecord)
        
        if (rawRecord) {
          // 将传统模式的记录转换为新的格式
          onChainRecord = {
            proof: rawRecord.proof,
            publicSignals: rawRecord.publicSignals,
            ownerAddress: rawRecord.pubKeyHash, // 传统模式使用 pubKeyHash 作为 ownerAddress
            validUntil: rawRecord.validUntil
          }
          hasOnChainRecord = true
        }
        
        this.logger.debug(
          'Using traditional mode, fetched on-chain record:',
          onChainRecord,
        )
      } else {
        throw new Error('Either artworkHash or onChainRecord must be provided')
      }

      if (!onChainRecord) {
        this.logger.debug('No on-chain record found')
        return { 
          isValid: false, 
          isOwner: false, 
          hasOnChainRecord: false,
          details: {
            recordType,
            error: 'No on-chain record found'
          }
        }
      }

      // 验证证明
      const isValid = await ZKUtils.verifyProof(
        onChainRecord.proof,
        onChainRecord.publicSignals,
      )
      this.logger.debug('Proof verification result:', isValid)
      
      // 检查有效期
      const currentTime = Math.floor(Date.now() / 1000)
      const isExpired = onChainRecord.validUntil <= currentTime
      this.logger.debug('Proof expiration check:', { 
        validUntil: onChainRecord.validUntil, 
        currentTime,
        isExpired 
      })
      
      // 检查地址匹配（仅在提供了 ownerAddress 时进行）
      let isOwner: string | boolean = 'Not verified' // 默认为 true，表示不验证所有权
      if (dto.ownerAddress) {
        isOwner =
          onChainRecord.ownerAddress.toLowerCase().trim() ===
          dto.ownerAddress.toLowerCase().trim()
        this.logger.debug('Address match result:', isOwner)
        this.logger.debug('Expected address:', dto.ownerAddress)
        this.logger.debug('Actual address:', onChainRecord.ownerAddress)
      } else {
        this.logger.debug(
          'Skipping address verification as ownerAddress is not provided',
        )
      }
      
      return {
        isValid: isValid && !isExpired, // 证明有效且未过期
        isOwner,
        hasOnChainRecord,
        details: {
          expectedAddress: dto.ownerAddress,
          actualAddress: onChainRecord.ownerAddress,
          proofValid: isValid,
          addressVerified: !!dto.ownerAddress,
          recordType,
          expiration: {
            validUntil: onChainRecord.validUntil,
            currentTime,
            isExpired
          }
        },
      }
    } catch (error) {
      this.logger.error('Failed to verify artwork ownership', error.stack)
      throw new Error('Failed to verify artwork ownership')
    }
  }

  async generateKeccak256Hash(
    file: Express.Multer.File,
  ): Promise<{ hash: string }> {
    try {
      this.logger.log('Generating keccak256 hash from file...')

      // 创建临时文件
      const tempDir = os.tmpdir()
      const tempFilePath = path.join(tempDir, file.originalname)

      // 写入临时文件
      await fs.promises.writeFile(tempFilePath, file.buffer)

      // 读取文件内容
      const fileContent = await fs.promises.readFile(tempFilePath)

      // 生成哈希
      const hash = ethers.keccak256(fileContent)

      // 删除临时文件
      await fs.promises.unlink(tempFilePath)

      return { hash }
    } catch (error) {
      this.logger.error('Failed to generate keccak256 hash', error.stack)
      throw new Error('Failed to generate keccak256 hash')
    }
  }

  async generateKeyPair(): Promise<{
    address: string
    publicKey: string
    privateKey: string
  }> {
    try {
      this.logger.log('Generating key pair...')

      // 生成随机钱包
      const wallet = ethers.Wallet.createRandom()

      return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
      }
    } catch (error) {
      this.logger.error('Failed to generate key pair', error.stack)
      throw new Error('Failed to generate key pair')
    }
  }

  async downloadKeyPair(downloadToken: string): Promise<{
    privateKey: string
    publicKey: string
    address: string
  } | null> {
    const keyPair = this.keyPairs.get(downloadToken)
    if (keyPair) {
      // 获取后立即删除
      this.keyPairs.delete(downloadToken)
      return keyPair
    }
    return null
  }
}
