import { BONDS_SUBGRAPH_URL } from '@sushiswap/bonds-sdk'
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql'

import fs from 'fs'

const schemas = {
  blocks: 'api.studio.thegraph.com/query/72545/ethereum-blocks/v0.0.2',
  bonds: BONDS_SUBGRAPH_URL[1],
  bentobox: 'api.studio.thegraph.com/query/32073/bentobox-ethereum/v0.0.1',
  furo: 'api.studio.thegraph.com/query/32073/furo-ethereum/v0.0.1',
  'master-chef-v1': 'api.studio.thegraph.com/query/32073/masterchef/v0.0.1',
  'master-chef-v2': 'api.studio.thegraph.com/query/32073/master-chefv2/v0.0.1',
  'mini-chef':
    'api.studio.thegraph.com/query/32073/minichef-arbitrum/version/latest',
  'sushi-bar': 'api.studio.thegraph.com/query/32073/xsushi/v0.0.1',
  'sushi-v2': 'api.studio.thegraph.com/query/32073/v2-arbitrum/v0.0.5',
  'sushi-v3': 'api.studio.thegraph.com/query/32073/v3-arbitrum/v0.0.1',
} as const satisfies Record<string, string>

async function updateSchema(schema: keyof typeof schemas) {
  const path = `./src/subgraphs/${schema}/schema.graphql`
  const url = schemas[schema]

  try {
    const res = await fetch(`https://${url}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://sushi.com',
      },
      body: JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    })

    const content = printSchema(buildClientSchema((await res.json()).data))

    fs.writeFileSync(path, content)
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

if (fs.statSync('./schema.graphql', { throwIfNoEntry: false })) {
  fs.rmSync('./schema.graphql')
}

res.forEach((r) => {
  if (r.success) {
    console.log(`Updated ${r.schema} schema`)
  } else {
    console.error(`Failed to update ${r.schema} schema`, r.error)
  }
})
