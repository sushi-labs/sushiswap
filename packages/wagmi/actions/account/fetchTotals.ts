import { bentoBoxV1Abi, bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Address, readContracts } from '@wagmi/core'

export async function fetchTotals(args: { token: Address; user: Address; chainId: BentoBoxV1ChainId }[]) {
  const contracts = args.map(({ token, chainId }) => ({
    chainId,
    address: bentoBoxV1Address[chainId],
    functionName: 'totals' as const,
    args: [token as Address] as const,
    abi: bentoBoxV1Abi[chainId],
  }))

  const totals = await readContracts({
    allowFailure: true,
    contracts,
  })

  return Object.fromEntries(
    totals
      .filter((value) => !!value && value[0].gt(0) && value[1].gt(0))
      .map((value, i) => [`${args[i].chainId}:${args[i].token}`, value])
  )
}
