import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../graphql'
import { ImageFieldsFragment } from 'src/subgraphs/strapi/fragments/image-fields'
import { AuthorFieldsFragment } from 'src/subgraphs/strapi/fragments/author-fields'
import { STRAPI_GRAPHQL_URL } from 'src/subgraphs/strapi/constants'
import { transformImage } from 'src/subgraphs/strapi/transforms/transform-image'

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

export type GetBlogArticles = VariablesOf<typeof StrapiBlogArticlesQuery>

export type BlogArticleMeta = Awaited<
  ReturnType<typeof getBlogArticles>
>['meta']

export type BlogArticle = Awaited<
  ReturnType<typeof getBlogArticles>
>['articles'][number]

export async function getBlogArticles(
  variables: GetBlogArticles = {},
  options?: RequestOptions,
) {
  if (!variables.filters?.articleType || !variables.filters.articleTypes) {
    if (!variables.filters) {
      variables.filters = {}
    }
    variables.filters.articleType = { eq: 'blog' }
  }

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
