import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from '../lib/schema'
import { prisma } from '../lib/context'
import playground from 'graphql-playground-middleware-express'

const app = express()

app.use(
  '/graphql',
  graphqlHTTP((request) => ({
    schema: schema,
    context: {
      prisma,
      request,
    },
  })),
)

app.get('/playground', playground({ endpoint: '/graphql' }))

export default app
