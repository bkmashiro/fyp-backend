import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray, IsObject, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArtworkProofDto {
  @IsString()
  @IsNotEmpty()
  artworkHash: string;  // 艺术品的哈希值

  @IsString()
  @IsNotEmpty()
  signature: string;    // 用户对艺术品的签名

  @IsString()
  @IsOptional()
  nonce?: string;    // 随机数（可选，用于交互式验证）

  @IsNumber()
  @IsOptional()
  @Min(1)
  ttl?: number;   // 证明的有效期（秒，可选，默认14天）
}

export class ZKProofDto {
  @IsArray()
  @IsNotEmpty()
  pi_a: string[];      // 证明的第一部分

  @IsArray()
  @IsNotEmpty()
  pi_b: string[][];    // 证明的第二部分

  @IsArray()
  @IsNotEmpty()
  pi_c: string[];      // 证明的第三部分

  @IsString()
  @IsNotEmpty()
  protocol: string;    // 协议类型

  @IsString()
  @IsNotEmpty()
  curve: string;       // 曲线类型
}

export class OnChainRecordDto {
  @ValidateNested()
  @Type(() => ZKProofDto)
  @IsNotEmpty()
  proof: ZKProofDto;   // 零知识证明

  @IsArray()
  @IsNotEmpty()
  publicSignals: string[]; // 公共信号

  @IsString()
  @IsNotEmpty()
  ownerAddress: string;   // 所有者地址
}

export class VerifyArtworkOwnershipDto {
  @IsString()
  @IsOptional()
  ownerAddress?: string; // 要验证的所有者地址（可选）

  @IsString()
  @IsOptional()
  artworkHash?: string; // 艺术品的哈希值（可选，用于传统模式）

  @ValidateNested()
  @Type(() => OnChainRecordDto)
  @IsOptional()
  onChainRecord?: OnChainRecordDto; // 链上记录（可选，用于零知识模式）
} 