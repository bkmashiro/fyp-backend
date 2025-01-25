import { Injectable } from '@nestjs/common'
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3Service {
  private s3Client: S3Client
  private bucketName: string

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'eu-west-1',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })

    this.bucketName = this.configService.get('AWS_BUCKET_NAME')
  }

  async listBuckets() {
    const command = new ListBucketsCommand({})
    const response = await this.s3Client.send(command)
    return response.Buckets
  }

  async listObjects() {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
    })
    const response = await this.s3Client.send(command)
    return response.Contents
  }

  async getObject(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })
    const response = await this.s3Client.send(command)
    return response
  }

  async putObject(key: string, body: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
    })
    const response = await this.s3Client.send(command)
    return response
  }

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })
    const response = await this.s3Client.send(command)
    return response
  }

  async uploadFile(file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.originalname,
      Body: file.buffer,
    })
    const response = await this.s3Client.send(command)
    return response
  }
}
