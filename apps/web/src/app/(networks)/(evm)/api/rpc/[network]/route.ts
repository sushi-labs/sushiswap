import { checkBotId } from 'botid/server'
import { getRpcHeaders, getRpcUrl } from 'src/lib/rpc'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ network: string }> },
): Promise<Response> {
  const { network } = await params
  if (!/^[a-z0-9-]+$/.test(network)) {
    return Response.json({ error: 'Invalid network' }, { status: 400 })
  }

  try {
    const { isBot } = await checkBotId({
      advancedOptions: { checkLevel: 'basic' },
    })
    if (isBot) {
      return Response.json(
        { error: 'Bot verification failed' },
        { status: 403 },
      )
    }
  } catch {
    return Response.json(
      { error: 'Bot verification unavailable' },
      { status: 503 },
    )
  }

  if (!process.env.DRPC_ID) {
    return Response.json({ error: 'RPC unavailable' }, { status: 503 })
  }

  try {
    const response = await fetch(getRpcUrl(network), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getRpcHeaders() },
      body: await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'error',
      signal: request.signal,
    })

    const headers = new Headers({ 'Cache-Control': 'no-store' })
    for (const name of ['Content-Type', 'Retry-After']) {
      const value = response.headers.get(name)
      if (value) headers.set(name, value)
    }

    return new Response(response.body, { status: response.status, headers })
  } catch {
    return Response.json({ error: 'RPC unavailable' }, { status: 502 })
  }
}
