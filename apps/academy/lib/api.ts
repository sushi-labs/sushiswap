import { ArticleFiltersInput, getMeshSDK, PaginationArg } from '../.mesh'

export const getArticleAndMoreArticles = async (slug: string, preview: Record<string, unknown> | null) => {
  const sdk = getMeshSDK()

  try {
    return await sdk.articleAndMoreArticles({
      filters: {
        slug: { eq: slug },
        articleType: { eq: 'academy' },
      },
      filters_ne: { slug: { not: { eq: slug } }, articleType: { eq: 'academy' } },
      publicationState: preview ? 'PREVIEW' : 'LIVE',
    })
  } catch (e) {
    console.error(e)
  }
}

export const getAllArticlesBySlug = async () => {
  const sdk = getMeshSDK()
  return await sdk.getAllArticlesWithSlug()
}

export const getGlobalSEO = async () => {
  const sdk = getMeshSDK()
  return await sdk.getGlobalSEO()
}

export const getPreviewPostBySlug = async (slug: string) => {
  const sdk = getMeshSDK()
  return await sdk.getPreviewPostBySlug({ slug })
}

export const getArticles = async (variables?: {
  filters?: ArticleFiltersInput
  pagination?: PaginationArg
  sort?: string[]
}) => {
  const sdk = getMeshSDK()
  return await sdk.getArticles({
    ...variables,
    filters: { ...variables.filters, articleType: { eq: 'academy' } },
    sort: variables.sort ?? ['publishedAt:desc'],
  })
}

export const getTopics = async () => {
  const sdk = getMeshSDK()
  return await sdk.GetTopics()
}

export const getDifficulties = async () => {
  const sdk = getMeshSDK()
  return await sdk.GetDifficulties()
}
