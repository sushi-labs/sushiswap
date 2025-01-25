import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { graphql } from '../graphql.js'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants.js'
import { ImageFieldsFragment } from 'src/subgraphs/strapi/fragments/image-fields.js'
import { transformImage } from 'src/subgraphs/strapi/transforms/transform-image.js'

export const StrapiProductsQuery = graphql(
  `query Products {
    products {
      data {
        id
        attributes {
          name
          description
          longName
          slug
          url
          relevantArticleIds
          shareImage {
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

export type GetProducts = VariablesOf<typeof StrapiProductsQuery>

export type Product = Awaited<ReturnType<typeof getProducts>>[number]

export async function getProducts(
  _variables: GetProducts = {},
  options?: RequestOptions,
) {
  const variables = _variables as VariablesOf<typeof StrapiProductsQuery>

  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiProductsQuery,
      variables,
    },
    options,
  )

  if (!result.products) {
    throw new Error('Failed to fetch products')
  }

  return result.products.data.map((product) => ({
    id: product.id,
    name: product.attributes.name,
    description: product.attributes.description,
    longName: product.attributes.longName,
    slug: product.attributes.slug,
    url: product.attributes.url,
    relevantArticleIds: product.attributes.relevantArticleIds,
    shareImage: product?.attributes?.shareImage?.data
      ? transformImage(product.attributes.shareImage.data)
      : null,
  }))
}
