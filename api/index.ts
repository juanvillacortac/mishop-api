import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../lib/schema'
import { prisma } from '../lib/context'
import playground from 'graphql-playground-middleware-express'
import { getUserFromJWT } from '@/lib/utils'

const app = express()

app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP(async (request) => {
    const user = await getUserFromJWT({ prisma, request: request as any })
    return {
      schema: schema,
      context: {
        prisma,
        request,
        user,
        getUser() {
          if (!user) {
            throw new Error('Not authorized')
          }
          return user
        }
      },
    }
  }),
)

app.get('/playground', playground({ endpoint: '/graphql' }))

export default app
