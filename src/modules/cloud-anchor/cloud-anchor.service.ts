import { Injectable } from '@nestjs/common'
import { CreateCloudAnchorDto } from './dto/create-cloud-anchor.dto'
import { UpdateCloudAnchorDto } from './dto/update-cloud-anchor.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Raw, Repository } from 'typeorm'
import { CloudAnchor } from './entities/cloud-anchor.entity'
import { exec } from 'child_process'
import { promisify } from 'util'
import axios from 'axios'

const execAsync = promisify(exec)

export interface AnchorResponse {
  name: string
  createTime: string
  expireTime: string
  lastLocalizeTime: string
  maximumExpireTime: string
}

export interface ListAnchorsResponse {
  anchors: AnchorResponse[]
  nextPageToken?: string
}

@Injectable()
export class CloudAnchorService {
  private token: string
  private readonly baseUrl = 'https://arcore.googleapis.com/v1beta2/management'

  constructor(
    @InjectRepository(CloudAnchor)
    private readonly cloudAnchorRepository: Repository<CloudAnchor>,
  ) {
    this.getToken().then((token) => {
      this.token = token
      console.log('management token', this.token)
    })
  }

  create(createCloudAnchorDto: CreateCloudAnchorDto) {
    console.log('createCloudAnchorDto', createCloudAnchorDto)
    return CloudAnchor.create({
      ...createCloudAnchorDto,
      anchor: {
        type: 'Point',
        coordinates: createCloudAnchorDto.anchorPosition,
      },
    }).save()
  }

  async findAnchorsInArea(lat: number, lon: number, radius: number) {
    return this.cloudAnchorRepository.find({
      where: {
        anchor: Raw(
          (alias) =>
            `ST_DWithin(${alias}, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :radius)`,
          { lat, lon, radius },
        ),
      },
    })
  }

  findOne(cloudAnchorId: string) {
    return this.cloudAnchorRepository.findOne({
      where: {
        cloudAnchorId,
      },
    })
  }

  async listAnchors(pageSize: number = 50, nextPageToken?: string) {
    try {
      const url = `${this.baseUrl}/anchors`
      const params = {
        page_size: pageSize,
        order_by: 'last_localize_time desc',
        ...(nextPageToken && { next_page_token: nextPageToken }),
      }

      const response = await axios.get<ListAnchorsResponse>(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      })

      return response.data
    } catch (error) {
      console.error('Error listing anchors:', error)
      throw error
    }
  }

  async getAnchor(anchorId: string) {
    try {
      const url = `${this.baseUrl}/anchors/${anchorId}`
      const response = await axios.get<AnchorResponse>(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })

      return response.data
    } catch (error) {
      console.error('Error getting anchor:', error)
      throw error
    }
  }

  async updateAnchorExpireTime(anchorId: string, expireTime: string) {
    try {
      const url = `${this.baseUrl}/anchors/${anchorId}`
      const response = await axios.patch<AnchorResponse>(
        url,
        { expireTime },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          params: {
            updateMask: 'expire_time',
          },
        },
      )

      return response.data
    } catch (error) {
      console.log(`Bearer ${this.token}`)
      console.error('Error updating anchor:', error)
      throw error
    }
  }

  async deleteAnchor(anchorId: string) {
    try {
      const url = `${this.baseUrl}/anchors/${anchorId}`
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
    } catch (error) {
      console.error('Error deleting anchor:', error)
      throw error
    }
  }

  async getToken() {
    try {
      const { stdout } = await execAsync(
        './bin/oauth2l fetch --json mythical-maxim-443015-i2-6e4411cb575c.json arcore.management',
      )
      return stdout.trim().replace(/\s+/g, '')
    } catch (error) {
      console.error('Error getting token:', error)
      throw error
    }
  }
}
