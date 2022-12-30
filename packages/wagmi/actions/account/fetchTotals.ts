import { bentoBoxV1Abi } from '@sushiswap/abi'
import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { Address, readContracts } from '@wagmi/core'

export async function fetchTotals(args: { token: Address; user: Address; chainId: number }[]) {
  const contracts = args.map(({ token, chainId }) => ({
    chainId,
    address: BENTOBOX_ADDRESS[chainId] as Address,
    functionName: 'totals' as const,
    args: [token as Address] as const,
    abi: bentoBoxV1Abi,
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
