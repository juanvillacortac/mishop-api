import { getUserFromJWT } from '@/lib/utils'
import { updateUser } from '@/resolvers/user'
import { arg, inputObjectType, intArg, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus'
import { ImageAttachment, ImageAttachmentInput, PaymentMethodEnum } from './common'

export const ShopAccount = objectType({
  name: 'ShopAccount',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('name')
    t.nonNull.string('slug')

    t.nonNull.string('instagram')
    t.string('tiktok')
    t.string('facebook')

    t.nonNull.phoneNumber('phoneNumber')

    t.nonNull.boolean('hasWhatsapp')
    t.list.field('paymentMethods', { type: PaymentMethodEnum })

    t.nullable.field('logo', { type: ImageAttachment })
  },
})

export const ShopUpdateInput = inputObjectType({
  name: 'ShopUpdateInput',
  definition(t) {
    t.string('name')

    t.string('instagram')
    t.string('tiktok')
    t.string('facebook')
    t.string('slug')

    t.phoneNumber('phoneNumber')

    t.boolean('hasWhatsapp')
    t.list.field('paymentMethods', { type: PaymentMethodEnum })

    t.field('logo', { type: ImageAttachmentInput })
  },
})

export const ShopFromTokenQuery = queryField('getShopFromToken', {
  type: ShopAccount,
  resolve: async (_parent, _args, ctx) => (await getUserFromJWT(ctx)).shop,
})

export const ShopQuery = queryField('getShop', {
  type: ShopAccount,
  args: {
    id: intArg(),
    slug: stringArg(),
  },
  resolve: (_parent, args, ctx) => {
    if (!args.id && !args.slug) {
      throw new Error('"id" or "slug" args must be defined')
    }
    return ctx.prisma.shopAccount.findFirst({
      where: {
        id: args.id ?? undefined,
        slug: args.slug ?? undefined,
      },
      include: {
        logo: true
      }
    })
  }
})

export const ShopUpdateMutation = mutationField('updateShop', {
  type: ShopAccount,
  args: {
    data: nonNull(arg({
      type: ShopUpdateInput,
    }))
  },
  resolve: async (_parent, args, ctx) => (await updateUser({ data: { shop: args.data } }, ctx)).shop
})
