import { getUserFromJWT } from '@/lib/utils'
import { Context } from '@/lib/context'
import { NexusGenArgTypes } from '@/lib/generated/nexus'
import { DeliveryMethod as DMethod } from '@prisma/client'

type QueryArgs = NexusGenArgTypes['Query']
type MutationArgs = NexusGenArgTypes['Mutation']

export const getDeliveryMethods = async (args: QueryArgs['getDeliveryMethods'], ctx: Context) => {
  let shopId: number
  if (!args.shopSlug) {
    shopId = (await getUserFromJWT(ctx)).shop.id
  }
  return await ctx.prisma.deliveryMethod.findMany({
    where: {
      id: args.id ?? undefined,
      active: args.active ?? undefined,
      shopId,
      shop: {
        id: args.shopId ?? undefined,
        slug: args.shopSlug ?? undefined,
      }
    },
  })
}

export const getDeliveryMethod = (args: QueryArgs['getDeliveryMethods'], ctx: Context) => ctx.prisma.deliveryMethod.findUnique({
  where: {
    id: args.id,
  },
})

export const upsertDeliveryMethods = async (args: MutationArgs['upsertDeliveryMethods'], ctx: Context) => {
  const shop = (await getUserFromJWT(ctx)).shop

  const data = args.data.filter(d => Object.keys(d).length)

  const toCreate = data.filter(d => d.id === null || typeof d.id === 'undefined')
  const toUpdate = data.filter(d => d.id)

  let [created, updated]: [DMethod[], DMethod[]] = [[], []]

  if (toCreate?.length) {
    created = await ctx.prisma.$transaction(toCreate.map(d => ctx.prisma.deliveryMethod.create({
      data: {
        name: d.name || '',
        price: d.price || 0,
        shop: {
          connect: {
            userId: shop.id,
          }
        },
      }
    })))
  }

  if (toUpdate?.length) {
    const [model] = await ctx.prisma.$transaction(toUpdate.map(d => ctx.prisma.shopAccount.update({
      where: {
        id: shop.id,
      },
      select: {
        deliveryMethods: true
      },
      data: {
        deliveryMethods: {
          update: {
            where: {
              id: d.id,
            },
            data: {
              id: d.id,
              active: d.active ?? undefined,
              name: d.name ?? undefined,
              price: d.price ?? undefined,
              requestDirection: d.requestDirection ?? undefined,
              admitCash: d.admitCash ?? undefined,
            },
          }
        }
      }
    })))
    const ids = toUpdate.map(d => d.id)
    updated = model.deliveryMethods.filter(d => ids.includes(d.id))
  }

  return [...created, ...updated]
}
