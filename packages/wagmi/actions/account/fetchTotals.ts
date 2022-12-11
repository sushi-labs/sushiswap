import { bentoBoxV1Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { BENTOBOX_ADDRESS, BentoBoxChainId} from '@sushiswap/address';
import { Address, erc20ABI, readContracts } from '@wagmi/core'

export async function fetchTotals(
  args: { token: Address; user: Address; chainId: BentoBoxChainId }[]
) {
  return readContracts({
    allowFailure: true,
    contracts: args.map(
      ({ token, user, chainId }) =>
        ({
          address: BENTOBOX_ADDRESS[chainId],
          functionName: 'totals',
          args: [user],
          chainId,
          abi: bentoBoxV1Abi,
        } as const)
    ),
  }).then((values) => Object.fromEntries(
    values.filter((balance) => !!balance && balance[0].gt(0) && balance[1].gt(0))
      .map((balance, i) => [`${args[i].chainId}:${args[i].token}`, balance])
  ) 
}
