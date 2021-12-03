import { ImageAttachment, PrismaClient, ShopAccount, User as DBUser, Customer as DBCustomer } from '@prisma/client'

type User = DBUser & {
  shop: ShopAccount & {
    logo: ImageAttachment
  }
}

type Customer = DBCustomer & {
  shop: ShopAccount
}
export interface Context {
  prisma: PrismaClient
  request?: Request
  user?: User
  customer?: Customer
  getUser?: () => User
  getCustomer?: () => Customer
}

export const prisma = new PrismaClient()
