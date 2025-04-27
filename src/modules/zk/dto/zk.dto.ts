import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArtworkProofDto {
  @IsString()
  @IsNotEmpty()
  artworkHash: string;  // 艺术品的哈希值

  @IsString()
  @IsNotEmpty()
  signature: string;    // 用户对艺术品的签名
}

export class OnChainRecordDto {
  @IsString()
  @IsNotEmpty()
  proof: any;          // 零知识证明

  @IsString()
  @IsNotEmpty()
  publicSignals: any[]; // 公共信号

  @IsString()
  @IsNotEmpty()
  artworkHash: string;  // 艺术品的哈希值

  @IsString()
  @IsNotEmpty()
  pubKeyHash: string;   // 所有者公钥哈希
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