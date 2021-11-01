import { makeSchema } from 'nexus'
import * as types from '../types'

import { fileURLToPath } from 'url'
import path from 'path'

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(fileURLToPath(import.meta.url), '../../schema.graphql'),
    typegen: path.join(fileURLToPath(import.meta.url), '../generated/nexus.d.ts'),
  },
  contextType: {
    export: 'Context',
    module: path.join(fileURLToPath(import.meta.url), '../context.ts'),
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
