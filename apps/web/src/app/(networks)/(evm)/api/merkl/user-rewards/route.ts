import { MERKL_BASE_URL } from 'src/lib/hooks/react-query/rewards/merkl-base-url'
import { isChainId } from 'sushi'
import { isEvmAddress } from 'sushi/evm'

const apiKey = process.env.MERKL_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const test = searchParams.get('test')
  const chainId = searchParams.get('chainId')
  const account = searchParams.get('account')
  if (!test) return new Response('Missing test parameter', { status: 400 })
  if (!chainId || !isChainId(+chainId))
    return new Response('Missing or invalid chainId parameter', {
      status: 400,
    })
  if (!account || !isEvmAddress(account))
    return new Response('Missing or invalid account parameter', {
      status: 400,
    })
  const url = new URL(`${MERKL_BASE_URL}/users/${account}/rewards`)
  url.searchParams.set('test', test)
  url.searchParams.set('chainId', chainId)
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
