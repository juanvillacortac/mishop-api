import { pageObjectType } from '@/lib/utils'
import { arg, inputObjectType, intArg, list, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus'
import { OrderEnum, PaymentMethodEnum } from './common'
import { Product } from './product'
import { Customer } from './customer'
import { DeliveryMethod } from './delivery-method'

export const OrderItem = objectType({
  name: 'OrderItem',
  definition(t) {
    t.nonNull.string('id')
    t.field('product', { type: Product })
    t.int('quantity')
    t.int('price')
  }
})

export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.field('customer', { type: Customer })
    t.nonNull.list.field('products', { type: OrderItem })
    t.nonNull.field('paymentMethod', { type: PaymentMethodEnum })
    t.nonNull.jsonObject('paymentData')
    t.nonNull.field('deliveryMethod', { type: DeliveryMethod })
    t.nonNull.jsonObject('deliveryMethodData')
    t.nonNull.string('status')
    t.nonNull.float('total')
    t.nonNull.date('createdAt')
  }
})

export const OrderPage = pageObjectType('OrderPage', Order)

export const OrderItemInput = inputObjectType({
  name: 'OrderItemInput',
  definition(t) {
    t.nonNull.string('id')
    t.int('quantity')
  }
})

export const OrderInput = inputObjectType({
  name: 'OrderInput',
  definition(t) {
    t.nonNull.list.field('products', { type: OrderItemInput })
    t.nonNull.field('paymentMethod', { type: PaymentMethodEnum })
    t.jsonObject('paymentData')
    t.nonNull.string('deliveryMethodId')
    t.jsonObject('deliveryMethodData')
    t.string('status')
  },
})

export const OrderStatusLog = objectType({
  name: 'OrderStatusLog',
  definition(t) {
    t.string('id')
    t.string('status')
    t.date('datetime')
  },
})

export const GetOrderStatusLogs = queryField('getOrderStatusLogs', {
  type: list(OrderStatusLog),
  args: {
    id: nonNull(stringArg()),
    order: arg({
      type: OrderEnum,
      default: 'desc',
    })
  },
  resolve: (_parent, args, ctx) => ctx.prisma.orderStatusLog.findMany({
    where: {
      orderId: args.id,
    },
    orderBy: [
      { datetime: args.order, },
    ],
  }),
})

export const UpdateOrderInput = inputObjectType({
  name: 'UpdateOrderInput',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('status')
  },
})

export const GetOrderQuery = queryField('getOrder', {
  type: Order,
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, args, ctx) => {
    return ctx.prisma.order.findUnique({
      where: {
        id: args.id,
      },
      include: {
        customer: true,
        products: true,
        deliveryMethod: true,
      }
    })
  }
})

export const GetOrdersQuery = queryField('getOrders', {
  type: OrderPage,
  args: {
    skip: intArg({ description: 'Skip the first N number of products', default: 0 }),
    take: intArg({ description: 'Take +N products from the current position of cursor', default: 10 }),
    status: stringArg({ description: 'Filter orders by status' }),
    shopId: stringArg({ description: 'Shop id' }),
    shopSlug: stringArg({ description: 'Shop slug' }),
    order: arg({
      type: OrderEnum,
      default: 'desc',
    })
    // active: booleanArg({ description: 'If is not defined, active and inactive are listed' }),
  },
  resolve: async (_parent, args, ctx) => {
    let shopId = args.shopId
    if (!args.shopSlug && !shopId && !ctx.customer) {
      shopId = ctx.getUser().shop?.id
    }

    const where = {
      shopId,
      customer: ctx.customer ? {
        id: ctx.customer.id
      } : undefined,
      shop: (shopId || args.shopSlug) && !ctx.customer ? {
        id: shopId ?? undefined,
        slug: args.shopSlug ?? undefined,
      } : undefined,
      status: args.status ?? undefined,
    }

    const [total, orders] = await ctx.prisma.$transaction([
      ctx.prisma.order.count({ where }),
      ctx.prisma.order.findMany({
        skip: args.skip,
        take: args.take,
        where,
        orderBy: { createdAt: args.order, },
        include: {
          customer: true,
          products: {
            include: {
              product: {
                include: {
                  shop: true,
                  images: true,
                  categories: true,
                }
              },
            }
          },
          deliveryMethod: true,
        }
      }),
    ])
    return {
      total,
      items: orders,
    }
  }
})

export const CreateOrderMutation = mutationField('createOrder', {
  type: Order,
  args: {
    data: OrderInput
  },
  resolve: async (_parent, args, ctx) => {
    const products = await Promise.all(args.data.products.map(async p => ({
      ...p,
      product: await ctx.prisma.product.findUnique({
        where: { id: p.id }
      })
    })))
    const delivery = await ctx.prisma.deliveryMethod.findUnique({
      where: { id: args.data.deliveryMethodId }
    })
    const total = products
      .map(p => (p.product.promotionalPrice ?? p.product.price) * p.quantity)
      .reduce((a, b) => a + b, 0) + delivery.price
    return ctx.prisma.order.create({
      data: {
        paymentMethod: args.data.paymentMethod,
        paymentData: args.data.paymentData,
        total,
        customer: {
          connect: { id: ctx.getCustomer().id },
        },
        shop: {
          connect: { id: ctx.getCustomer().shopId },
        },
        status: args.data.status,
        statusLogs: {
          create: {
            status: args.data.status ?? 'process'
          }
        },
        deliveryMethodData: args.data.deliveryMethodData,
        deliveryMethod: {
          connect: { id: args.data.deliveryMethodId },
        },
        products: {
          createMany: {
            data: products.map(p => ({
              productId: p.id,
              price: p.product.promotionalPrice ?? p.product.price,
              quantity: p.quantity,
            }))
          }
        },
      },
      include: {
        customer: true,
        products: {
          include: {
            product: {
              include: {
                shop: true,
                images: true,
                categories: true,
              }
            },
          }
        },
        deliveryMethod: true,
      }
    })
  }
})

export const UpdateOrderMutation = mutationField('updateOrder', {
  type: Order,
  args: {
    data: UpdateOrderInput
  },
  resolve: async (_parent, args, ctx) => {
    let shopId = ctx.customer ? ctx.getCustomer().shopId : ctx.getUser().shop.id
    const where = {
      id: args.data.id,
      customer: ctx.customer ? {
        id: ctx.customer.id
      } : undefined,
      shop: {
        id: shopId,
      },
    }
    const existent = await ctx.prisma.order.findFirst({
      where,
      select: {
        status: true,
      }
    })
    if (!existent) {
      throw new Error('Order not found')
    }
    const product = await ctx.prisma.order.update({
      where: {
        id: args.data.id,
      },
      data: {
        status: args.data.status,
      },
      include: {
        customer: true,
        products: {
          include: {
            product: {
              include: {
                shop: true,
                images: true,
                categories: true,
              }
            },
          }
        },
        deliveryMethod: true,
      }
    })
    if (existent.status !== args.data.status) {
      await ctx.prisma.orderStatusLog.create({
        data: {
          status: args.data.status,
          orderId: args.data.id,
        }
      })
    }
    return product
  }
})
