import { pageObjectType } from '@/lib/utils'
import { inputObjectType, intArg, nonNull, objectType, queryField, stringArg, mutationField, list } from 'nexus'
import { ImageAttachmentInput, PaymentMethodEnum } from './common'
import { ShopAccount } from './shop'
import { DeliveryMethod, Product as DProduct, ShopAccount as DShopAccount, ImageAttachment as DImageAttachment, Order as DOrder } from '@prisma/client'

export const OrderItem = objectType({
  name: 'OrderItem',
  definition(t) {
    t.nonNull.int('id')
  }
})

export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.field('shop', { type: ShopAccount })
    t.field('paymentMethod', { type: PaymentMethodEnum })
    t.nonNull.boolean('hasVariants')
    t.list.nonNull.jsonObject('variants')
    t.nonNull.float('price')
    t.nonNull.float('promotionalPrice')
    t.nonNull.int('stock')
    t.nonNull.int('min')
    t.nonNull.date('createdAt')
  }
})

export const ProductPage = pageObjectType('ProductPage', Order)

export const ProductInput = inputObjectType({
  name: 'ProductInput',
  definition(t) {
    t.int('id')
    t.nonEmptyString('name')
    t.list.field('images', { type: ImageAttachmentInput })
    t.list.jsonObject('variants')
    t.float('price')
    t.float('promotionalPrice')
    t.int('stock')
    t.int('min')
  },
})

export const GetProductsQuery = queryField('getProducts', {
  type: ProductPage,
  args: {
    skip: intArg({ description: 'Skip the first N number of products', default: 0 }),
    take: intArg({ description: 'Take +N products from the current position of cursor', default: 10 }),
    shopId: intArg({ description: 'Shop id' }),
    shopSlug: stringArg({ description: 'Shop slug' }),
    // active: booleanArg({ description: 'If is not defined, active and inactive are listed' }),
  },
  resolve: async (_parent, args, ctx) => {
    let shopId = args.shopId
    if (!args.shopSlug && !shopId) {
      shopId = ctx.getUser().shop?.id
    }
    ctx.prisma.orderItem.create({
      data: {

      }
    })
    const where = {
      shopId,
      shop: {
        id: shopId ?? undefined,
        slug: args.shopSlug ?? undefined,
      }
    }
    const [total, products] = await ctx.prisma.$transaction([
      ctx.prisma.product.count({ where }),
      ctx.prisma.product.findMany({
        skip: args.skip,
        take: args.take,
        where,
        include: {
          shop: {
            include: {
              deliveryMethods: true,
              products: true,
            }
          }
        }
      }),
    ])
    return {
      total,
      items: products,
    }
  }
})

export const GetProductQuery = queryField('getProduct', {
  type: Order,
  args: {
    id: nonNull(intArg()),
  },
  resolve: (_parent, args, ctx) => ctx.prisma.product.findUnique({
    where: { id: args.id },
    include: {
      images: true,
      shop: {
        include: {
          deliveryMethods: true,
          logo: true,
        }
      }
    }
  })
})

type ProductComplete = DProduct & {
  images: DImageAttachment[]
  shop: DShopAccount & {
      logo: DImageAttachment
      deliveryMethods: DeliveryMethod[]
  };
} 

export const UpsertProductsMutation = mutationField('upsertProducts', {
  type: list(Order),
  args: {
    data: nonNull(list(ProductInput)),
  },
  resolve: async (_parent, args, ctx) => {
    const shop = ctx.getUser().shop

    const data = args.data.filter(d => Object.keys(d).length)

    const toCreate = data.filter(d => d.id === null || typeof d.id === 'undefined')
    const toUpdate = data.filter(d => d.id)

    let [created, updated]: [ProductComplete[], ProductComplete[]] = [[], []]

    if (toCreate?.length) {
      created = await ctx.prisma.$transaction(toCreate.map(p => ctx.prisma.product.create({
        include: {
          images: true,
          shop: {
            include: {
              deliveryMethods: true,
              logo: true,
            }
          }
        },
        data: {
          shopId: shop.id,
          name: p.name || '',
          price: p.price || 0,
          promotionalPrice: p.promotionalPrice || 0,
          hasVariants: Boolean(p.variants.length),
          min: p.min || 0,
          stock: p.stock || 0,
          variants: p.variants || [],
          images: p.images?.length ? {
            createMany: {
              data: p.images.map(i => ({
                original: i.original || '',
                normal: i.normal || '',
                thumbnail: i.thumbnail || '',
              }))
            }
          } : undefined
        }
      })))
    }

    if (toUpdate?.length) {
      const [model] = await ctx.prisma.$transaction(toUpdate.map(p => ctx.prisma.shopAccount.update({
        where: {
          id: shop.id,
        },
        select: {
          products: {
            include: {
              images: true,
              shop: {
                include: {
                  deliveryMethods: true,
                  logo: true,
                }
              }
            }
          }
        },
        data: {
          products: {
            update: {
              where: {
                id: p.id,
              },
              data: {
                ...p,
                images: p.images ? {
                  deleteMany: {},
                  createMany: {
                    data: p.images.map(i => ({
                      original: i.original || '',
                      normal: i.normal || '',
                      thumbnail: i.thumbnail || '',
                    }))
                  }
                } : undefined
              },
            }
          }
        }
      })))
      const ids = toUpdate.map(d => d.id)
      updated = model.products.filter(d => ids.includes(d.id))
    }

    return [...created, ...updated]
  }
})
