export function getStrapiMedia(url: string) {
  return url.startsWith('/') ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${url}` : url
}
