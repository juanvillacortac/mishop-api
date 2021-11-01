import { asNexusMethod } from 'nexus'
import { DateTimeResolver, JWTResolver, PhoneNumberResolver, EmailAddressResolver } from 'graphql-scalars'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')
export const PhoneNumber = asNexusMethod(PhoneNumberResolver, 'phoneNumber')
export const JWT = asNexusMethod(JWTResolver, 'jwt')
export const EmailAddress = asNexusMethod(EmailAddressResolver, 'email')

export * from './common'
export * from './shop'
export * from './user'
