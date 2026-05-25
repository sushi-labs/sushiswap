const apiKey = process.env.MERKL_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url) return new Response('Missing url', { status: 400 })

  const response = await fetch(
    decodeURIComponent(url),
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

    return Response.json(data)
  } catch (error) {
    console.log(error)
    return new Response('Error fetching Merkl data', { status: 500 })
  }
}
