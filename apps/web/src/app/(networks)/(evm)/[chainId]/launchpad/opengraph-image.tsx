import { GET } from './embed/route'

export const alt = 'Discover tokens on Sushi Launchpad'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
export const revalidate = 60

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  return GET(new Request('https://www.sushi.com'), { params })
}
