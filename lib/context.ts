import { PrismaClient } from '@prisma/client'

export interface Context {
  prisma: PrismaClient
  request?: Request
}

export const prisma = new PrismaClient()
