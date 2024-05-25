import { BONDS_SUBGRAPH_URL } from '@sushiswap/bonds-sdk'
import {
  BLOCKS_SUBGRAPH_URL,
  MASTERCHEF_V1_SUBGRAPH_URL,
  MASTERCHEF_V2_SUBGRAPH_URL,
  MINICHEF_SUBGRAPH_URL,
  SUSHISWAP_SUBGRAPH_URL,
  SUSHISWAP_V3_SUBGRAPH_URL,
  SUSHI_BAR_SUBGRAPH_URL,
} from '@sushiswap/graph-config'

import fs from 'fs'

import fetchSchema from 'graphql-fetch-schema'

const schemas = {
  blocks: BLOCKS_SUBGRAPH_URL[1],
  bonds: BONDS_SUBGRAPH_URL[1],
  'master-chef-v1': MASTERCHEF_V1_SUBGRAPH_URL,
  'master-chef-v2': MASTERCHEF_V2_SUBGRAPH_URL,
  'mini-chef': MINICHEF_SUBGRAPH_URL[137],
  'sushi-bar': SUSHI_BAR_SUBGRAPH_URL,
  'sushi-v2': SUSHISWAP_SUBGRAPH_URL[1],
  'sushi-v3': SUSHISWAP_V3_SUBGRAPH_URL[1],
} as const satisfies Record<string, string>

async function updateSchema(schema: keyof typeof schemas) {
  const path = `./src/subgraphs/${schema}/schema.graphql`
  const url = schemas[schema]

  try {
    const [{ contents }] = await fetchSchema.default(`https://${url}/`, {
      json: false,
      graphql: true,
    })

    fs.writeFileSync(path, contents)
  } catch (e) {
    return {
      schema,
      success: false,
      error: e,
    }
  }

  return {
    schema,
    success: true,
  }
}

const res = await Promise.all(
  Object.keys(schemas).map((schema) =>
    updateSchema(schema as keyof typeof schemas),
  ),
)

fs.rmSync('./schema.graphql')

res.forEach((r) => {
  if (r.success) {
    console.log(`Updated ${r.schema} schema`)
  } else {
    console.error(`Failed to update ${r.schema} schema`, r.error)
  }
})
