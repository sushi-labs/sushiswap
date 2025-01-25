import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { graphql } from '../graphql.js'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants.js'
import { ImageFieldsFragment } from 'src/subgraphs/strapi/fragments/image-fields.js'

export const StrapiBannersQuery = graphql(
  `query Banners {
    banners {
      data {
        id
        attributes {
          dateFrom
          dateTo
          link
          image {
            data {
              ...ImageFields
            }
          }
        }
      }
    }
  }`,
  [ImageFieldsFragment],
)

export type GetBanners = VariablesOf<typeof StrapiBannersQuery>

export type Banner = Awaited<ReturnType<typeof getBanners>>[number]

export async function getBanners(
  _variables: GetBanners = {},
  options?: RequestOptions,
) {
  const variables = _variables as VariablesOf<typeof StrapiBannersQuery>

  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiBannersQuery,
      variables,
    },
    options,
  )

  if (!result.banners) {
    throw new Error('Failed to fetch banners')
  }

  return result.banners.data.map((topic) => {
    const dateFrom = new Date(topic.attributes.dateFrom)
    const dateTo = new Date(topic.attributes.dateTo)

    const isActive = dateFrom <= new Date() && dateTo >= new Date()

    return {
      id: topic.id,
      dateFrom,
      dateTo,
      link: topic.attributes.link,
      image: topic.attributes.image.data,
      isActive,
    }
  })
}
