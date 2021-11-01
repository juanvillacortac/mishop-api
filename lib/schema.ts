import { makeSchema } from 'nexus'
import * as types from '../types'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __dirname = fileURLToPath(dirname(import.meta.url));

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(__dirname, '../schema.graphql'),
    typegen: path.join(__dirname, 'generated/nexus.d.ts'),
  },
  contextType: {
    export: 'Context',
    module: path.join(__dirname, 'context.ts'),
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
