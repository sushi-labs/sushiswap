import { ArticleFiltersInput, CategoryFiltersInput, getMeshSDK, PaginationArg } from '../.mesh'

export const getArticleAndMoreArticles = async (slug: string, preview: Record<string, unknown> | null) => {
  const sdk = getMeshSDK()

  try {
    return (
      (await sdk.articleAndMoreArticles({
        filters: {
          slug: { eq: slug },
        },
        filters_ne: { slug: { not: { eq: slug } } },
        publicationState: preview ? 'PREVIEW' : 'LIVE',
      })) ?? []
    )
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

export const getArticles = async (variables?: { filters?: ArticleFiltersInput; pagination?: PaginationArg }) => {
  const sdk = getMeshSDK()
  return await sdk.getArticles(variables)
}

export const getCategories = async (filters?: CategoryFiltersInput) => {
  const sdk = getMeshSDK()
  return await sdk.getCategories({ filters })
}
