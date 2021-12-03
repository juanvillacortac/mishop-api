import { inputObjectType, mutationField, objectType, queryField, stringArg } from "nexus"
import { Customer as DBCustomer } from '@prisma/client'
import { sign } from "jsonwebtoken"

export const Customer = objectType({
  name: 'Customer',
  definition(t) {
    t.nonNull.string('id')
    t.string('name')
    t.string('lastName')
    t.string('instagram')
    t.nonNull.email('email')
    t.phoneNumber('phoneNumber')
  }
})

export const UpsertCustomerInput = inputObjectType({
  name: 'UpsertCustomertInput',
  definition(t) {
    t.string('shopSlug')
    t.string('name')
    t.string('lastName')
    t.string('instagram')
    t.email('email')
    t.phoneNumber('phoneNumber')
  }
})

export const CustomerTokenPayload = objectType({
  name: 'CustomerTokenPayload',
  definition(t) {
    t.nonNull.field('customer', { type: Customer })
    t.nonNull.jwt('token')
  },
})

export const getCustomer = queryField('getCustomer', {
  type: Customer,
  args: {
    id: stringArg(),
  },
  resolve: (_parent, args, ctx) => {
    if (!args.id) {
      return ctx.getCustomer()
    }
    return ctx.prisma.customer.findUnique({
      where: {
        id: args.id,
      },
    })
  },
})

export const IssueCustomerMutation = mutationField('issueCustomer', {
  type: CustomerTokenPayload,
  args: {
    data: UpsertCustomerInput,
  },
  resolve: async (_parent, args, ctx) => {
    if (!args.data) {
      return {
        token: sign(ctx.getCustomer(), import.meta.env.VITE_JWT_SECRET),
        customer: ctx.getCustomer(),
      }
    }
    const isEdit = !!ctx.customer
    let customer: DBCustomer
    if (isEdit) {
      if (args.data?.shopSlug) {
        throw new Error('"shopSlug" field cannot be passed when is updating')
      }
      customer = await ctx.prisma.customer.update({
        where: {
          id: ctx.getCustomer().id
        },
        data: {
          ...args.data,
        }
      })
    } else {
      if (!args.data.email || !args.data.name || !args.data.shopSlug) {
        throw new Error('"email", "name" and "shopSlug" fields are mandatory when is creating')
      }
      const existent = await ctx.prisma.customer.findFirst({
        where: {
          shop: {
            slug: args.data.shopSlug,
          },
          email: args.data.email,
        }
      })
      if (existent) {
        throw new Error('A customer with that email in that shop already exists')
      }
      customer = await ctx.prisma.customer.create({
        data: {
          instagram: args.data.instagram,
          name: args.data.name || '',
          lastName: args.data.lastName,
          phoneNumber: args.data.phoneNumber,
          email: args.data.email || '',
          shop: {
            connect: {
              slug: args.data.shopSlug,
            }
          }
        }
      })
    }
    return {
      token: sign(customer.id, import.meta.env.VITE_JWT_SECRET),
      customer,
    }
  }
})
