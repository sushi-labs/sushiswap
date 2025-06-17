import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants.js'
import { graphql } from '../graphql.js'

export const StrapiDifficultiesQuery = graphql(
  `query Difficulties {
    difficulties(sort: ["id"]) {
      data {
        id
        attributes {
          name
          shortDescription
          longDescription
          slug
          label
        }
      }
    }
  }`,
)

export type GetDifficulties = VariablesOf<typeof StrapiDifficultiesQuery>

export type Difficulty = Awaited<ReturnType<typeof getDifficulties>>[number]

export async function getDifficulties(
  _variables: GetDifficulties = {},
  options?: RequestOptions,
) {
  const variables = _variables as VariablesOf<typeof StrapiDifficultiesQuery>

  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiDifficultiesQuery,
      variables,
    },
    options,
  )

  if (!result.difficulties) {
    throw new Error('Failed to fetch difficulties')
  }

  return result.difficulties.data.map((difficulty) => ({
    id: difficulty.id,
    name: difficulty.attributes.name,
    shortDescription: difficulty.attributes.shortDescription,
    longDescription: difficulty.attributes.longDescription,
    slug: difficulty.attributes.slug,
    label: difficulty.attributes.label,
  }))
}
