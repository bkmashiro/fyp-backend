import { User } from '@/modules/user/entities/user.entity'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
        username: string
        roles: string[]
      }
    }
  }
}
