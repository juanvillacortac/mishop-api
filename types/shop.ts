import { updateUser } from '@/resolvers/user'
import { arg, inputObjectType, intArg, mutationField, nonNull, objectType, queryField, queryType, stringArg } from 'nexus'
import { ImageAttachment, ImageAttachmentInput, PaymentMethodEnum } from './common'

export const ShopAccount = objectType({
  name: 'ShopAccount',
  definition(t) {
    t.nonNull.int('id')
    t.nonEmptyString('name')
    t.nonEmptyString('slug')
    t.string('description')

    t.nonEmptyString('instagram')
    t.nonEmptyString('tiktok')
    t.nonEmptyString('facebook')

    t.phoneNumber('phoneNumber')

    t.boolean('hasWhatsapp')
    t.list.field('paymentMethods', { type: PaymentMethodEnum })
    t.jsonObject('paymentMethodsMetadata')

    t.nullable.field('logo', { type: ImageAttachment })
  },
})

export const ShopUpdateInput = inputObjectType({
  name: 'ShopUpdateInput',
  definition(t) {
    t.nonEmptyString('name')

    t.string('description')

    t.nonEmptyString('instagram')
    t.nonEmptyString('tiktok')
    t.nonEmptyString('facebook')
    t.nonEmptyString('slug')

    t.phoneNumber('phoneNumber')

    t.boolean('hasWhatsapp')
    t.list.field('paymentMethods', { type: PaymentMethodEnum })
    t.jsonObject('paymentMethodsMetadata')

    t.field('logo', { type: ImageAttachmentInput })
  },
})

export const ShopSlugOutput = objectType({
  name: 'ShopSlugOutput',
  definition(t) {
    t.boolean('exists')
  },
})

export const checkShopSlugQuery = queryField('checkShopSlug', {
  type: ShopSlugOutput,
  args: {
    slug: nonNull(stringArg()),
  },
  resolve: async (_parent, args, ctx) => {
    const shop = await ctx.prisma.shopAccount.findUnique({
      select: {
        slug: true,
      },
      where: {
        slug: args.slug,
      }
    })
    return {
      exists: Boolean(shop)
    }
  },
})

export const ShopFromTokenQuery = queryField('getShopFromToken', {
  type: ShopAccount,
  resolve: async (_parent, _args, ctx) => ctx.getUser().shop,
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
