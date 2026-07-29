import { GET } from './embed/route'

export const alt = 'Sushi Launchpad token market overview'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
export const revalidate = 60

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ chainId: string; address: string }>
}) {
  return GET(new Request('https://www.sushi.com'), { params })
}
