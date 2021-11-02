import { getUserFromJWT } from '@/lib/utils'
import { DeliveryMethod as DMethod } from '@prisma/client'
import { booleanArg, inputObjectType, intArg, list, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus'

export const DeliveryMethod = objectType({
  name: 'DeliveryMethod',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.nonEmptyString('name')
    t.nonNull.float('price')
    t.nonNull.boolean('admitCash')
    t.nonNull.boolean('requestDirection')
    t.nonNull.boolean('active')
  },
})

export const DeliveryMethodInput = inputObjectType({
  name: 'DeliveryMethodInput',
  definition(t) {
    t.int('id')
    t.nonEmptyString('name')
    t.float('price')
    t.boolean('admitCash')
    t.boolean('requestDirection')
    t.boolean('active')
  },
})

export const DeliveryMethodsQuery = queryField('getDeliveryMethods', {
  type: list(DeliveryMethod),
  args: {
    id: intArg({ description: 'Delivery method id' }),
    shopId: intArg({ description: 'Shop id' }),
    shopSlug: stringArg({ description: 'Shop slug' }),
    active: booleanArg({ description: 'If is not defined, active and inactive are listed' }),
  },
  resolve: async (_parent, args, ctx) => {
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
})

export const DeliveryMethodQuery = queryField('getDeliveryMethod', {
  type: DeliveryMethod,
  args: {
    id: nonNull(intArg()),
  },
  resolve: async (_parent, args, ctx) => ctx.prisma.deliveryMethod.findUnique({
    where: {
      id: args.id,
    },
  })
})

export const UpsertDeliveryMethodsMutation = mutationField('upsertDeliveryMethods', {
  type: list(DeliveryMethod),
  args: {
    data: nonNull(list(DeliveryMethodInput)),
  },
  resolve: async (_parent, args, ctx) => {
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
})
