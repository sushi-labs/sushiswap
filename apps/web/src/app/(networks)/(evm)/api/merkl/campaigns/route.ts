import { MERKL_BASE_URL } from 'src/lib/hooks/react-query/rewards/merkl-base-url'

const apiKey = process.env.MERKL_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const test = searchParams.get('test')
  const chainId = searchParams.get('chainId')
  const mainParameter = searchParams.get('mainParameter')
  if (!test) return new Response('Missing test parameter', { status: 400 })
  if (!chainId)
    return new Response('Missing chainId parameter', { status: 400 })
  if (!mainParameter)
    return new Response('Missing mainParameter parameter', { status: 400 })

  const url = new URL(`${MERKL_BASE_URL}/campaigns`)
  url.searchParams.set('test', test)
  url.searchParams.set('chainId', chainId)
  url.searchParams.set('mainParameter', mainParameter)
  const response = await fetch(
    url.toString(),
    apiKey ? { headers: { 'X-API-Key': apiKey } } : undefined,
  )
  if (!response.ok) {
    return new Response(
      `Error fetching data from Merkl API: ${response.statusText}`,
      { status: response.status },
    )
  }
  try {
    const data = await response.json()

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response('Error fetching Merkl data', { status: 500 })
  }
}
