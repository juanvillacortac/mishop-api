import { getDeliveryMethod, getDeliveryMethods, upsertDeliveryMethods } from '@/resolvers/delivery-method'
import { booleanArg, inputObjectType, intArg, list, mutationField, nonNull, objectType, queryField, stringArg } from 'nexus'
import { PaymentMethodEnum } from './common'

export const DeliveryMethod = objectType({
  name: 'DeliveryMethod',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.nonEmptyString('name')
    t.string('description')
    t.nonNull.float('price')
    t.nonNull.boolean('admitCash')
    t.nonNull.boolean('requestDirection')
    t.nonNull.list.field('specificPaymentMethods', { type: PaymentMethodEnum })
    t.nonNull.boolean('active')
  },
})

export const DeliveryMethodInput = inputObjectType({
  name: 'DeliveryMethodInput',
  definition(t) {
    t.string('id')
    t.string('description')
    t.nonEmptyString('name')
    t.float('price')
    t.boolean('admitCash')
    t.boolean('requestDirection')
    t.list.field('specificPaymentMethods', { type: PaymentMethodEnum })
    t.boolean('active')
  },
})

export const DeliveryMethodsQuery = queryField('getDeliveryMethods', {
  type: list(DeliveryMethod),
  args: {
    id: stringArg({ description: 'Delivery method id' }),
    shopId: stringArg({ description: 'Shop id' }),
    shopSlug: stringArg({ description: 'Shop slug' }),
    active: booleanArg({ description: 'If is not defined, active and inactive are listed' }),
  },
  resolve: (_parent, args, ctx) => getDeliveryMethods(args, ctx)
})

export const DeliveryMethodQuery = queryField('getDeliveryMethod', {
  type: DeliveryMethod,
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, args, ctx) => getDeliveryMethod(args, ctx)
})

export const UpsertDeliveryMethodsMutation = mutationField('upsertDeliveryMethods', {
  type: list(DeliveryMethod),
  args: {
    data: nonNull(list(DeliveryMethodInput)),
  },
  resolve: async (_parent, args, ctx) => upsertDeliveryMethods(args, ctx)
})
