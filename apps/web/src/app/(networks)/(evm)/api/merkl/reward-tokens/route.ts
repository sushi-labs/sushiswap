import { MERKL_BASE_URL } from 'src/lib/hooks/react-query/rewards/merkl-base-url'

const apiKey = process.env.MERKL_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chainId = searchParams.get('chainId')
  if (!chainId)
    return new Response('Missing chainId parameter', { status: 400 })

  const url = new URL(`${MERKL_BASE_URL}/tokens/reward/${chainId}`)
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
