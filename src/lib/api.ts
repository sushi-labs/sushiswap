export function getStrapiURL(path = '') {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}/api${path}`
}

// Helper to make GET requests to Strapi
export async function fetchAPI(path: string) {
  const requestUrl = getStrapiURL(path)
  const response = await fetch(requestUrl)
  return await response.json()
}

export interface Banner {
  attributes: {
    name: string
    url: string
    image: {
      data: {
        attributes: {
          url: string
        }
      }
    }
    startDate: string
    endDate: string
  }
}

export async function fetchBanners() {
  return (await fetchAPI('/banners?populate=image'))?.data as Banner[]
}
