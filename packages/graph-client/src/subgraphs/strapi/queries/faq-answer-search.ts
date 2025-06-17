import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants.js'
import { graphql } from '../graphql.js'

export const StrapiFaqAnswerSearchQuery = graphql(
  `query FaqAnswerSearch($search: String!, $pagination: PaginationArg = {}) {
    faqAnswers(filters: { name: { containsi: $search } }, pagination: $pagination) {
      data {
        attributes {
          name
          slug
          faqAnswerGroup {
            data {
              attributes {
                slug
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

    faqAnswerGroups(filters: { name: { containsi: $search } }, pagination: $pagination) {
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
  }`,
)

export type GetFaqAnswerSearch = VariablesOf<typeof StrapiFaqAnswerSearchQuery>

export type FaqAnswerSearch = Awaited<ReturnType<typeof getFaqAnswerSearch>>

/**
 * @brief Purposefully built for the search box
 */
export async function getFaqAnswerSearch(
  variables: GetFaqAnswerSearch,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiFaqAnswerSearchQuery,
      variables,
    },
    options,
  )

  if (!result.faqAnswerGroups || !result.faqAnswers) {
    throw new Error('Failed to fetch for search')
  }

  const faqAnswerGroups = result.faqAnswerGroups.data
  const faqAnswers = result.faqAnswers.data

  const answerGroups = faqAnswerGroups.map((group) => {
    let slug = `${group.attributes.faqCategory.data?.attributes.slug}/${group.attributes.slug}`

    if (group.attributes.faqDefaultAnswer?.data?.attributes.slug) {
      slug += `/${group.attributes.faqDefaultAnswer?.data?.attributes.slug}`
    }

    return {
      name: group.attributes.name,
      slug,
    }
  })

  const answers = faqAnswers.map((answer) => ({
    name: answer.attributes.name,
    slug: `${answer.attributes.faqAnswerGroup.data?.attributes.faqCategory.data?.attributes.slug}/${answer.attributes.faqAnswerGroup.data?.attributes.slug}/${answer.attributes.slug}`,
  }))

  return { answers, answerGroups }
}
