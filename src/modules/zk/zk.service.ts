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

@Injectable()
export class ZkService {
  private readonly logger = new Logger(ZkService.name)

  constructor(
    private readonly hederaService: HederaService
  ) {
    setTimeout(() => {
      this.generateTestData()
    }, 3000)
  }

  private async generateTestData() {
    try {
      // 生成测试钱包
      const wallet = ethers.Wallet.createRandom()
      
      // 生成测试艺术品数据
      const artworkData = "Test Artwork #1"
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
        signature
      }
      await this.createArtworkProof(dto)

      // 验证测试证明
      const verifyDto: VerifyArtworkOwnershipDto = {
        artworkHash,
        ownerAddress: wallet.address
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
      
      const { proof, publicSignals } = await ZKUtils.generateZKProof({
        sigHash: dto.signature,
        artHash: dto.artworkHash
      })

      // 上链存证
      await this.hederaService.submitToChain(TopicType.ARTWORK, {
        proof,
        publicSignals,
        artworkHash: dto.artworkHash,
        pubKeyHash: ownerAddress
      })

      return {
        proof,
        publicSignals,
        ownerAddress
      }
    } catch (error) {
      this.logger.error('Failed to create artwork proof', error.stack)
      throw new Error('Failed to create artwork proof')
    }
  }

  async verifyArtworkOwnership(dto: VerifyArtworkOwnershipDto) {
    try {
      this.logger.log('Verifying artwork ownership...')
      
      // 从链上获取记录
      const onChainRecord = await this.hederaService.findRecord(TopicType.ARTWORK, {
        artworkHash: dto.artworkHash,
        pubKeyHash: dto.ownerAddress
      })

      if (!onChainRecord) {
        return { isValid: false, isOwner: false, hasOnChainRecord: false }
      }

      // 验证证明
      const isValid = await ZKUtils.verifyProof(onChainRecord.proof, onChainRecord.publicSignals)
      
      return {
        isValid,
        isOwner: isValid && onChainRecord.pubKeyHash === dto.ownerAddress,
        hasOnChainRecord: true
      }
    } catch (error) {
      this.logger.error('Failed to verify artwork ownership', error.stack)
      throw new Error('Failed to verify artwork ownership')
    }
  }
}
