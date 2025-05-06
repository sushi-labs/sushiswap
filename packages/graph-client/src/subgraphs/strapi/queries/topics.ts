import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { graphql } from '../graphql.js'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants.js'

export const StrapiTopicsQuery = graphql(
  `query Topics {
    topics {
      data {
        id
        attributes {
          name
          slug
        }
      }
    }
  }`,
)

export type GetTopics = VariablesOf<typeof StrapiTopicsQuery>

export type Topic = Awaited<ReturnType<typeof getTopics>>[number]

export async function getTopics(
  _variables: GetTopics = {},
  options?: RequestOptions,
) {
  const variables = _variables as VariablesOf<typeof StrapiTopicsQuery>

  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiTopicsQuery,
      variables,
    },
    options,
  )

  if (!result.topics) {
    throw new Error('Failed to fetch topics')
  }

  return result.topics.data.map((topic) => ({
    id: topic.id,
    name: topic.attributes.name,
    slug: topic.attributes.slug,
  }))
}
