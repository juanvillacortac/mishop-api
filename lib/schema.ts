import { makeSchema } from 'nexus'
import * as types from '../types'

import path from 'path'

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(import.meta.url, '../../schema.graphql').substring(6),
    typegen: path.join(import.meta.url, '../generated/nexus.d.ts').substring(6),
  },
  contextType: {
    export: 'Context',
    module: path.join(import.meta.url, '../context.ts').substring(6),
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
