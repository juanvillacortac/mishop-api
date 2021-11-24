import { arg, inputObjectType, mutationField, nonNull, objectType, queryField } from 'nexus'
import { loginUser, registerUser, updateUser } from '../resolvers/user'
import { ShopAccount, ShopUpdateInput } from './shop'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.email('email')
    t.nonNull.nonEmptyString('name')
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
    t.nonNull.nonEmptyString('password')
    t.nonNull.nonEmptyString('name')
    t.nonEmptyString('instagram')
    t.nonEmptyString('shopName')
    t.nonEmptyString('shopSlug')
    t.string('shopDescription')
    t.phoneNumber('phoneNumber')
    t.boolean('hasWhatsapp')
  },
})

export const UserLoginInput = inputObjectType({
  name: 'UserLoginInput',
  definition(t) {
    t.nonNull.email('email')
    t.nonNull.nonEmptyString('password')
  },
})

export const UserUpdateInput = inputObjectType({
  name: 'UserUpdateInput',
  definition(t) {
    t.email('email')
    t.nonEmptyString('name')
    t.nonEmptyString('password')
    t.field('shop', { type: ShopUpdateInput })
  },
})

export const UserFromTokenQuery = queryField('getUserFromToken', {
  type: User,
  resolve: (_parent, _args, ctx) => ctx.getUser(),
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
