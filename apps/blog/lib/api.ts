import { ArticleFiltersInput, CategoryFiltersInput, getMeshSDK, PaginationArg } from '../.mesh'

const sdk = getMeshSDK()

export const getArticleAndMoreArticles = async (slug: string, preview: Record<string, unknown> | null) => {
  return sdk.articleAndMoreArticles({
    filters: {
      slug: { eq: slug },
      articleType: { eq: 'blog' },
    },
    filters_ne: { slug: { not: { eq: slug } } },
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

export const getArticles = async (variables?: { filters?: ArticleFiltersInput; pagination?: PaginationArg }) => {
  return sdk.getArticles({ ...variables, filters: { ...variables?.filters, articleType: { eq: 'blog' } } })
}

export const getCategories = async (filters?: CategoryFiltersInput) => {
  return sdk.getCategories({ filters })
}
