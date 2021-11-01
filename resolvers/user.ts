import { getUserFromJWT } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Context } from '@/lib/context'
import { NexusGenArgTypes } from '@/lib/generated/nexus'

type registerUserArgs = NexusGenArgTypes['Mutation']['registerUser']
type loginUserArgs = NexusGenArgTypes['Mutation']['loginUser']
type updateUserArgs = NexusGenArgTypes['Mutation']['updateUser']

export const registerUser = async (args: registerUserArgs, ctx: Context) => {
  try {
    const user = await ctx.prisma.user.create({
      data: {
        name: args.data.name,
        email: args.data.email,
        account: {
          create: {
            hash: await hash(args.data.password, 10)
          }
        },
        role: 'USER',
        shop: {
          create: {
            slug: args.data.shopSlug,
            instagram: args.data.instagram,
            name: args.data.shopName,
            phoneNumber: args.data.phoneNumber,
          }
        },
      },
      include: {
        shop: {
          include: {
            logo: true
          },
        },
      }
    })
    return {
      token: sign(user, import.meta.env.VITE_JWT_SECRET),
      user,
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        throw new Error('Email or instagram are taken')
      }
    } else {
      throw new Error(error.message)
    }
  }
}

export const loginUser = async (args: loginUserArgs, ctx: Context) => {
  const account = await ctx.prisma.account.findFirst({
    where: {
      user: {
        email: {
          equals: args.data.email,
        },
      },
    },
    include: {
      user: {
        include: {
          shop: true
        },
      },
    }
  })
  if (account && await compare(args.data.password, account.hash)) {
    return {
      token: sign(account.user, import.meta.env.VITE_JWT_SECRET),
      user: account.user
    }
  } else {
    throw new Error('Email or password incorrect')
  }
}

export const updateUser = async (args: updateUserArgs, ctx: Context) => {
  try {
    const payload = await getUserFromJWT(ctx)
    const user = await ctx.prisma.user.update({
      where: {
        email: payload.email,
      },
      include: {
        shop: {
          include: {
            logo: true
          }
        }
      },
      data: {
        name: args.data.name || undefined,
        email: args.data.email || undefined,
        shop: {
          update: {
            instagram: args.data.shop.instagram || undefined,
            facebook: args.data.shop.facebook || undefined,
            tiktok: args.data.shop.tiktok || undefined,
            phoneNumber: args.data.shop.phoneNumber || undefined,
            name: args.data.shop.name || undefined,
            slug: args.data.shop.slug || undefined,
            paymentMethods: args.data.shop.paymentMethods ? [...new Set(args.data.shop.paymentMethods)] : undefined,
            hasWhatsapp: args.data.shop.hasWhatsapp ?? undefined,
            logo: args.data.shop.logo ? {
              update: {
                original: args.data.shop.logo.original || '',
                normal: args.data.shop.logo.original || undefined,
                thumbnail: args.data.shop.logo.original || undefined,
              },
            } : undefined,
          }
        },
        account: args.data.password ? {
          update: {
            hash: await hash(args.data.password, 10)
          }
        } : undefined
      }
    })
    return user
  } catch (err) {
    throw new Error(err.message)
  }
}