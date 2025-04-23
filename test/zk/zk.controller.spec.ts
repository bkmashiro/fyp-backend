import { Test, TestingModule } from '@nestjs/testing'
import { ZkController } from '../../src/modules/zk/zk.controller'
import { ZkService } from '../../src/modules/zk/zk.service'
import { HederaService } from '../../src/modules/consensus/hedera/hedera.service'
import * as ed from '@noble/ed25519'
import { buildPoseidon } from 'circomlibjs'
import * as crypto from 'crypto'
import { Groth16Proof } from 'snarkjs'

describe('ZkController', () => {
  let controller: ZkController
  let zkService: ZkService
  let hederaService: HederaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZkController],
      providers: [
        {
          provide: ZkService,
          useValue: {
            generateZKProof: jest.fn(),
            verifyProof: jest.fn(),
          },
        },
        {
          provide: HederaService,
          useValue: {
            submitToChain: jest.fn(),
            findRecord: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<ZkController>(ZkController)
    zkService = module.get<ZkService>(ZkService)
    hederaService = module.get<HederaService>(HederaService)
  })

  describe('submitArtwork', () => {
    it('should submit artwork successfully', async () => {
      // 准备测试数据
      const privKey = ed.utils.randomPrivateKey()
      const pubKey = ed.getPublicKey(privKey)
      const message = 'test message'
      const sig = ed.sign(message, privKey)

      // 模拟服务返回
      const mockProof: Groth16Proof = {
        pi_a: ['1', '2'],
        pi_b: [['3', '4'], ['5', '6']],
        pi_c: ['7', '8'],
        protocol: 'groth16',
        curve: 'bn128',
      }
      const mockPublicSignals = ['1', '2']
      jest.spyOn(zkService, 'generateZKProof').mockResolvedValue({
        proof: mockProof,
        publicSignals: mockPublicSignals,
      })
      jest.spyOn(hederaService, 'submitToChain').mockResolvedValue(undefined)

      // 调用接口
      const result = await controller.submitArtwork({
        message,
        signature: Buffer.from(sig).toString('hex'),
        publicKey: Buffer.from(pubKey).toString('hex'),
      })

      // 验证结果
      expect(result.success).toBe(true)
      expect(result.proof).toEqual(mockProof)
      expect(result.publicSignals).toEqual(mockPublicSignals)
      expect(zkService.generateZKProof).toHaveBeenCalled()
      expect(hederaService.submitToChain).toHaveBeenCalled()
    })
  })

  describe('verifyArtwork', () => {
    it('should verify artwork successfully', async () => {
      // 准备测试数据
      const privKey = ed.utils.randomPrivateKey()
      const pubKey = ed.getPublicKey(privKey)
      const message = 'test message'
      const poseidon = await buildPoseidon()
      const pubKeyHash = poseidon([BigInt('0x' + Buffer.from(pubKey.subarray(0, 32)).toString('hex')), BigInt('0x' + Buffer.from(pubKey.subarray(32)).toString('hex'))]).toString()
      const msgHash = BigInt('0x' + crypto.createHash('sha256').update(message).digest('hex')).toString()

      // 模拟服务返回
      const mockRecord = {
        proof: {
          pi_a: ['1', '2'],
          pi_b: [['3', '4'], ['5', '6']],
          pi_c: ['7', '8'],
          protocol: 'groth16',
          curve: 'bn128',
        },
        publicSignals: ['1', '2'],
        artworkHash: msgHash,
        pubKeyHash,
      }
      jest.spyOn(hederaService, 'findRecord').mockResolvedValue(mockRecord)
      jest.spyOn(zkService, 'verifyProof').mockResolvedValue(true)

      // 调用接口
      const result = await controller.verifyArtwork(message, Buffer.from(pubKey).toString('hex'))

      // 验证结果
      expect(result.success).toBe(true)
      expect(result.message).toBe('验证成功')
      expect(result.record).toEqual(mockRecord)
      expect(hederaService.findRecord).toHaveBeenCalled()
      expect(zkService.verifyProof).toHaveBeenCalled()
    })

    it('should return false when record not found', async () => {
      // 准备测试数据
      const privKey = ed.utils.randomPrivateKey()
      const pubKey = ed.getPublicKey(privKey)
      const message = 'test message'

      // 模拟服务返回
      jest.spyOn(hederaService, 'findRecord').mockResolvedValue(null)

      // 调用接口
      const result = await controller.verifyArtwork(message, Buffer.from(pubKey).toString('hex'))

      // 验证结果
      expect(result.success).toBe(false)
      expect(result.message).toBe('未找到相关记录')
      expect(hederaService.findRecord).toHaveBeenCalled()
      expect(zkService.verifyProof).not.toHaveBeenCalled()
    })

    it('should return false when proof verification fails', async () => {
      // 准备测试数据
      const privKey = ed.utils.randomPrivateKey()
      const pubKey = ed.getPublicKey(privKey)
      const message = 'test message'
      const poseidon = await buildPoseidon()
      const pubKeyHash = poseidon([BigInt('0x' + Buffer.from(pubKey.subarray(0, 32)).toString('hex')), BigInt('0x' + Buffer.from(pubKey.subarray(32)).toString('hex'))]).toString()
      const msgHash = BigInt('0x' + crypto.createHash('sha256').update(message).digest('hex')).toString()

      // 模拟服务返回
      const mockRecord = {
        proof: {
          pi_a: ['1', '2'],
          pi_b: [['3', '4'], ['5', '6']],
          pi_c: ['7', '8'],
          protocol: 'groth16',
          curve: 'bn128',
        },
        publicSignals: ['1', '2'],
        artworkHash: msgHash,
        pubKeyHash,
      }
      jest.spyOn(hederaService, 'findRecord').mockResolvedValue(mockRecord)
      jest.spyOn(zkService, 'verifyProof').mockResolvedValue(false)

      // 调用接口
      const result = await controller.verifyArtwork(message, Buffer.from(pubKey).toString('hex'))

      // 验证结果
      expect(result.success).toBe(false)
      expect(result.message).toBe('验证失败')
      expect(result.record).toEqual(mockRecord)
      expect(hederaService.findRecord).toHaveBeenCalled()
      expect(zkService.verifyProof).toHaveBeenCalled()
    })
  })
}) 