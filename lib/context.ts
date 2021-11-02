import { ImageAttachment, PrismaClient, ShopAccount, User as DBUser } from '@prisma/client'

type User = DBUser & {
  shop: ShopAccount & {
    logo: ImageAttachment
  }
}
export interface Context {
  prisma: PrismaClient
  request?: Request
  user?: User
  getUser?: () => User
}

export const prisma = new PrismaClient()
