import { ArticleFiltersInput, CategoryFiltersInput, getBuiltGraphSDK, PaginationArg } from '../.graphclient'

export const getArticleAndMoreArticles = async (slug: string, preview: Record<string, unknown> | null) => {
  const sdk = getBuiltGraphSDK()

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
  const sdk = getBuiltGraphSDK()
  return await sdk.getAllArticlesWithSlug()
}

export const getGlobalPage = async () => {
  const sdk = getBuiltGraphSDK()
  return await sdk.getGlobalPage()
}

export const getPreviewPostBySlug = async (slug: string) => {
  const sdk = getBuiltGraphSDK()
  return await sdk.getPreviewPostBySlug({ slug })
}

export const getArticles = async (variables?: { filters?: ArticleFiltersInput; pagination?: PaginationArg }) => {
  const sdk = getBuiltGraphSDK()
  return await sdk.getArticles(variables)
}

export const getCategories = async (filters?: CategoryFiltersInput) => {
  const sdk = getBuiltGraphSDK()
  return await sdk.getCategories({ filters })
}
