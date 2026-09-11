import fs from 'node:fs/promises'
import { tradeValidator02 } from 'src/lib/hooks/react-query/trade/validator02'
import { API_BASE_URL } from 'src/lib/swap/api-base-url'
import { chainId, forkBlockNumber } from '../constants'
import { account } from '../fork'
import type { NetworkMocks } from '../intercept-anvil'
import manifest from './mock/137-manifest.json' with { type: 'json' }

export async function installSwapRecording(
  mocks: NetworkMocks,
  file: string,
): Promise<void> {
  if (
    manifest.chainId !== chainId ||
    manifest.forkBlockNumber !== forkBlockNumber ||
    manifest.sender.toLowerCase() !== account.address.toLowerCase() ||
    manifest.apiVersion !== 7
  ) {
    throw new Error('Swap recordings do not match the fork configuration')
  }
  const json: unknown = JSON.parse(await fs.readFile(file, 'utf8'))
  const data = tradeValidator02.parse(json)
  if (data.status !== 'Success')
    throw new Error(`Expected a successful recording: ${file}`)
  const input = data.tokens[data.tokenFrom].address.toLowerCase()
  const output = data.tokens[data.tokenTo].address.toLowerCase()
  mocks.add((request) => {
    const url = new URL(request.url)
    if (
      url.origin !== new URL(API_BASE_URL).origin ||
      ![`/quote/v7/${chainId}`, `/swap/v7/${chainId}`].includes(url.pathname)
    )
      return
    const params = url.searchParams
    if (
      params.get('tokenIn')?.toLowerCase() !== input ||
      params.get('tokenOut')?.toLowerCase() !== output ||
      params.get('amount') !== data.amountIn
    )
      return
    if (
      url.pathname.startsWith('/swap/') &&
      params.get('sender')?.toLowerCase() !== account.address.toLowerCase()
    ) {
      throw new Error(`Swap sender does not match recording: ${file}`)
    }
    // Validation coerces bigint fields; replay the original JSON wire shape.
    return Response.json(json, { status: 200 })
  })
}
