import { useQuery } from '@tanstack/react-query'

// Not exhaustinve
interface Response {
  data: {
    id: number
    attributes: {
      dateFrom: string
      dateTo: string
      link?: string
      createdAt: string
      updatedAt: string
      publishedAt: string
      image: {
        data: {
          id: number
          attributes: {
            name: string
            alternativeText: string
            caption: string
            width: number
            height: number
            mime: string
            url: string
            createdAt: string
            updatedAt: string
          }
        }
      }
    }
  }[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export const useActiveBanners = () => {
  return useQuery({
    queryKey: ['https://sushi-strapi-cms.herokuapp.com/api/banners'],
    queryFn: async () => {
      const date = new Date().toISOString()
      const data: Response = await fetch(
        `https://sushi-strapi-cms.herokuapp.com/api/banners?filters[dateTo][$gte]=${date}&filters[dateFrom][$lte]=${date}&populate=*`,
      ).then((response) => response.json())

      return data.data.map((entry) => ({
        ...entry.attributes,
        image: entry.attributes.image.data.attributes,
      }))
    },
    staleTime: 3600000, // 1 hr
    gcTime: 14400000, // 4hrs
    refetchOnWindowFocus: false,
  })
}
