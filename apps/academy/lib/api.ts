import { ArticleFiltersInput, getMeshSDK, GetProductsQueryVariables, PaginationArg } from '../.mesh'

const sdk = getMeshSDK()

export const getArticleAndMoreArticles = async (slug: string, preview: Record<string, unknown> | null) => {
  return sdk.articleAndMoreArticles({
    filters: {
      slug: { eq: slug },
      articleTypes: { type: { eq: 'academy' } },
    },
    filters_ne: { slug: { not: { eq: slug } }, articleTypes: { type: { eq: 'academy' } } },
    publicationState: preview ? 'PREVIEW' : 'LIVE',
  })
}

export const getAllArticlesBySlug = async () => {
  return sdk.getAllArticlesWithSlug()
}

export const getGlobalSEO = async () => {
  return sdk.getGlobalSEO()
}

export const getPreviewPostBySlug = async (slug: string) => {
  return sdk.getPreviewPostBySlug({ slug })
}

export const getArticles = async (variables?: {
  filters?: ArticleFiltersInput
  pagination?: PaginationArg
  sort?: string[]
}) => {
  return sdk.getArticles({
    ...variables,
    filters: { ...variables?.filters, articleTypes: { type: { eq: 'academy' } } },
    sort: variables?.sort ?? ['publishedAt:desc'],
  })
}

export const getTopics = async () => {
  return sdk.GetTopics()
}

export const getDifficulties = async () => {
  return sdk.GetDifficulties()
}

export const getProducts = async (variables?: GetProductsQueryVariables) => {
  return sdk.GetProducts(variables)
}

export const getLatestAndRelevantArticles = async (productSlug: string, relevantArticleIds: string[]) => {
  return sdk.GetLatestAndRelevantArticles({
    filters: {
      products: {
        slug: { eq: productSlug },
      },
      articleTypes: { type: { eq: 'academy' } },
    },
    filters_ne: {
      id: { in: relevantArticleIds },
      articleTypes: { type: { eq: 'academy' } },
    },
  })
}

export const getTrendingSearch = async () => {
  return sdk.GetTrendingSearch()
}
