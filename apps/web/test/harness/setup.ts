import { startProxy } from '@viem/anvil'
import { assertAnvilVersion } from '../anvil'
import { chainId, getAnvilPort } from '../constants'

export default async function setup(): Promise<() => Promise<void>> {
  assertAnvilVersion()
  // No archive RPC or app build needed to verify the infrastructure itself.
  return startProxy({
    host: '127.0.0.1',
    port: getAnvilPort(),
    options: { chainId },
  })
}
