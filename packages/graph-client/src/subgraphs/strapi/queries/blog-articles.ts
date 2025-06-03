import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants.js'
import { AuthorFieldsFragment } from 'src/subgraphs/strapi/fragments/author-fields.js'
import { ImageFieldsFragment } from 'src/subgraphs/strapi/fragments/image-fields.js'
import { transformImage } from 'src/subgraphs/strapi/transforms/transform-image.js'
import { graphql } from '../graphql.js'

export const StrapiBlogArticlesQuery = graphql(
  `query BlogArticles($filters: ArticleFiltersInput, $pagination: PaginationArg, $publicationState: PublicationState = LIVE, $sort: [String] = ["publishedAt:desc"]) {
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
          categories {
            data {
              id
              attributes {
                name
                description
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

export type GetBlogArticles = Omit<
  VariablesOf<typeof StrapiBlogArticlesQuery>,
  'filters'
> & {
  filters?: Omit<
    NonNullable<VariablesOf<typeof StrapiBlogArticlesQuery>['filters']>,
    'articleType' | 'articleTypes'
  > | null
}

export type BlogArticleMeta = Awaited<
  ReturnType<typeof getBlogArticles>
>['meta']

export type BlogArticle = Awaited<
  ReturnType<typeof getBlogArticles>
>['articles'][number]

export async function getBlogArticles(
  _variables: GetBlogArticles = {},
  options?: RequestOptions,
) {
  const variables = _variables as VariablesOf<typeof StrapiBlogArticlesQuery>

  if (!variables.filters) {
    variables.filters = {}
  }
  variables.filters.articleTypes = { type: { eq: 'blog' } }

  const result = await request(
    {
      url: STRAPI_GRAPHQL_URL,
      document: StrapiBlogArticlesQuery,
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
    categories: article.attributes.categories!.data.map((category) => ({
      id: category.id,
      name: category.attributes.name,
      description: category.attributes.description,
      slug: category.attributes.slug,
    })),
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
