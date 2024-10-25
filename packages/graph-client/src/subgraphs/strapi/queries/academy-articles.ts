import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../graphql'
import { ImageFieldsFragment } from 'src/subgraphs/strapi/fragments/image-fields'
import { AuthorFieldsFragment } from 'src/subgraphs/strapi/fragments/author-fields'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants'
import { transformImage } from 'src/subgraphs/strapi/transforms/transform-image'

export const StrapiAcademyArticlesQuery = graphql(
  `query AcademyArticles($filters: ArticleFiltersInput, $pagination: PaginationArg, $publicationState: PublicationState = LIVE, $sort: [String] = ["publishedAt:desc"]) {
    articles(filters: $filters, pagination: $pagination, publicationState: $publicationState, sort: $sort) {
      meta {
        pagination {
          total
          page
          pageSize
          pageCount
        }
      }

      data {
        id
        attributes {
          title
          description
          slug
          ghostSlug
          updatedAt
          publishedAt
          products {
            data {
              id
              attributes {
                name
                slug
              }
            }
          }
          topics {
            data {
              id
              attributes {
                name
              }
            }
          }
          difficulty {
            data {
              id
              attributes {
                name
                label
                slug
              }
            }
          }
          cover {
            data {
              ...ImageFields
            }
          }
          authors {
            data {
              ...AuthorFields
            }
          }
        }
      }
    }
  }`,
  [AuthorFieldsFragment, ImageFieldsFragment],
)

export type GetAcademyArticles = Omit<
  VariablesOf<typeof StrapiAcademyArticlesQuery>,
  'filters'
> & {
  filters?: Omit<
    NonNullable<VariablesOf<typeof StrapiAcademyArticlesQuery>['filters']>,
    'articleType' | 'articleTypes'
  > | null
}

export type AcademyArticleMeta = Awaited<
  ReturnType<typeof getAcademyArticles>
>['meta']

export type AcademyArticle = Awaited<
  ReturnType<typeof getAcademyArticles>
>['articles'][number]

export async function getAcademyArticles(
  _variables: GetAcademyArticles = {},
  options?: RequestOptions,
) {
  const variables = _variables as VariablesOf<typeof StrapiAcademyArticlesQuery>

  if (!variables.filters) {
    variables.filters = {}
  }
  variables.filters.articleTypes = { type: { eq: 'academy' } }

  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiAcademyArticlesQuery,
      variables,
    },
    options,
  )

  if (!result.articles) {
    throw new Error('Failed to fetch articles')
  }

  const meta = result.articles.meta.pagination

  const articles = result.articles.data.map((article) => ({
    id: article.id,
    title: article.attributes.title,
    description: article.attributes.description,
    ghostSlug: article.attributes.ghostSlug,
    slug: article.attributes.slug,
    updatedAt: article.attributes.updatedAt,
    publishedAt: article.attributes.publishedAt,
    products: article.attributes.products!.data.map((product) => ({
      id: product.id,
      name: product.attributes.name,
      slug: product.attributes.slug,
    })),
    topics: article.attributes.topics!.data.map((topic) => ({
      id: topic.id,
      name: topic.attributes.name,
    })),
    difficulty: article.attributes.difficulty.data
      ? {
          id: article.attributes.difficulty.data.id,
          name: article.attributes.difficulty.data.attributes.name,
          label: article.attributes.difficulty.data.attributes.label,
          slug: article.attributes.difficulty.data.attributes.slug,
        }
      : null,
    cover: transformImage(article.attributes.cover.data!),
    authors: article.attributes.authors!.data.map((author) => ({
      name: author.attributes.name,
      email: author.attributes.email,
      handle: author.attributes.handle,
      avatar: transformImage(author.attributes.avatar.data!),
    })),
  }))

  return { meta, articles }
}
