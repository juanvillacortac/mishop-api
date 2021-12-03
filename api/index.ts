import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../lib/schema'
import { prisma } from '../lib/context'
import playground from 'graphql-playground-middleware-express'
import { getCustomerFromJWT, getUserFromJWT } from '@/lib/utils'

const app = express()

app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP(async (request) => {
    const user = await getUserFromJWT({ prisma, request: request as any })
    const customer = await getCustomerFromJWT({ prisma, request: request as any })
    return {
      schema: schema,
      context: {
        prisma,
        request,
        user,
        customer,
        getUser() {
          if (!user) {
            throw new Error('Not authorized')
          }
          return user
        },
        getCustomer() {
          console.log(customer)
          if (!customer) {
            throw new Error('Not authorized')
          }
          return customer
        }
      },
    }
  }),
)

app.get('/playground', playground({ endpoint: '/graphql' }))

export default app
