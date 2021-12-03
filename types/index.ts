import {
  DateTimeResolver,
  JWTResolver,
  PhoneNumberResolver,
  EmailAddressResolver,
  NonEmptyStringResolver,
  JSONObjectResolver,
} from 'graphql-scalars'
import { asNexusMethod } from 'nexus'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')
export const PhoneNumber = asNexusMethod(PhoneNumberResolver, 'phoneNumber')
export const JWT = asNexusMethod(JWTResolver, 'jwt')
export const EmailAddress = asNexusMethod(EmailAddressResolver, 'email')
export const NonEmptyString = asNexusMethod(NonEmptyStringResolver, 'nonEmptyString')
export const JSONObject = asNexusMethod(JSONObjectResolver, 'jsonObject')

export * from './common'
export * from './shop'
export * from './delivery-method'
export * from './customer'
export * from './product'
export * from './user'
export * from './order'
