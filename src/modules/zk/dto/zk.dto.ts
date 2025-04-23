import { IsString, IsNotEmpty } from 'class-validator';

export class CreateArtworkProofDto {
  @IsString()
  @IsNotEmpty()
  artworkHash: string;  // 艺术品的哈希值

  @IsString()
  @IsNotEmpty()
  signature: string;    // 用户对艺术品的签名
}

export class VerifyArtworkOwnershipDto {
  @IsString()
  @IsNotEmpty()
  artworkHash: string;  // 艺术品的哈希值

  @IsString()
  @IsNotEmpty()
  ownerAddress: string; // 要验证的所有者地址
} 