import { arg, inputObjectType, mutationField, nonNull, objectType, queryField } from 'nexus'
import { getUserFromJWT } from '../lib/utils'
import { loginUser, registerUser, updateUser } from '../resolvers/user'
import { ShopAccount, ShopUpdateInput } from './shop'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.email('email')
    t.nonNull.string('name')
    t.nonNull.field('shop', { type: ShopAccount })
    t.date('createdAt')
  },
})

export const UserTokenPayload = objectType({
  name: 'UserTokenPayload',
  definition(t) {
    t.nonNull.field('user', { type: User })
    t.nonNull.jwt('token')
  },
})

export const UserRegisterInput = inputObjectType({
  name: 'UserRegisterInput',
  definition(t) {
    t.nonNull.email('email')
    t.nonNull.string('instagram')
    t.nonNull.phoneNumber('phoneNumber')
    t.nonNull.string('password')
    t.nonNull.string('name')
    t.nonNull.string('shopName')
    t.nonNull.string('shopSlug')
  },
})

export const UserLoginInput = inputObjectType({
  name: 'UserLoginInput',
  definition(t) {
    t.nonNull.email('email')
    t.nonNull.string('password')
  },
})

export const UserUpdateInput = inputObjectType({
  name: 'UserUpdateInput',
  definition(t) {
    t.email('email')
    t.string('name')
    t.string('password')
    t.field('shop', { type: ShopUpdateInput })
  },
})

export const UserFromTokenQuery = queryField('getUserFromToken', {
  type: User,
  resolve: (_parent, _args, ctx) => getUserFromJWT(ctx),
})

export const UserRegisterMutation = mutationField('registerUser', {
  type: UserTokenPayload,
  args: {
    data: nonNull(arg({
      type: UserRegisterInput
    }))
  },
  resolve: (_parent, args, ctx) => registerUser(args, ctx)
})

export const UserLoginMutation = mutationField('loginUser', {
  type: UserTokenPayload,
  args: {
    data: nonNull(arg({
      type: UserLoginInput
    }))
  },
  resolve: async (_parent, args, ctx) => loginUser(args, ctx),
})

export const UserUpdateMutation = mutationField('updateUser', {
  type: User,
  args: {
    data: nonNull(arg({
      type: UserUpdateInput,
    }))
  },
  resolve: async (_parent, args, ctx) => updateUser(args, ctx),
})