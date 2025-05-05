import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants.js'
import { graphql } from '../graphql.js'

export const StrapiFaqMostSearchedQuery = graphql(
  `query FaqMostSearched {
    faqMostSearcheds {
      data {
        id
        attributes {
          faqAnswerGroup {
            data {
              attributes {
                name
                slug
                faqDefaultAnswer {
                  data {
                    attributes {
                      slug
                    }
                  }
                }
                faqCategory {
                  data {
                    attributes {
                      slug
                    }
                  }
                }
              }
            }
          }
        } 
      }
    }
  }`,
)

export type GetFaqMostSearched = VariablesOf<typeof StrapiFaqMostSearchedQuery>

export type FaqMostSearched = Awaited<ReturnType<typeof getFaqMostSearched>>

export async function getFaqMostSearched(
  variables: GetFaqMostSearched = {},
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiFaqMostSearchedQuery,
      variables,
    },
    options,
  )

  if (!result.faqMostSearcheds) {
    throw new Error('Failed to fetch faq most searched')
  }

  const mostSearched = result.faqMostSearcheds.data
    .filter((mostSearched) => mostSearched.attributes.faqAnswerGroup?.data)
    .map((mostSearched) => {
      const faqAnswerGroup =
        mostSearched.attributes.faqAnswerGroup.data!.attributes
      const faqCategory = faqAnswerGroup.faqCategory.data!.attributes

      let url = `/faq/${faqCategory.slug}/${faqAnswerGroup.slug}`

      const faqDefaultAnswer =
        faqAnswerGroup?.faqDefaultAnswer?.data?.attributes

      if (faqDefaultAnswer) {
        url += `/${faqDefaultAnswer.slug}`
      }

      return {
        question: faqAnswerGroup.name,
        url,
      }
    })

  return mostSearched
}
