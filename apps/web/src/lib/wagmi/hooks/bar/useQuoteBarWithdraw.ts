import { useMemo } from 'react'
import { YOJIMBO_ADDRESS, yojimboAbi_quoteLeaveSushiBar } from 'src/lib/stake'
import { Amount } from 'sushi'
import { EvmChainId, type EvmToken, SUSHI } from 'sushi/evm'
import { useReadContract } from 'wagmi'

export const useQuoteBarWithdraw = ({
  amount,
  enabled = true,
}: { amount: Amount<EvmToken> | undefined; enabled?: boolean }) => {
  const readContractResponse = useReadContract({
    chainId: EvmChainId.ETHEREUM,
    address: YOJIMBO_ADDRESS,
    abi: yojimboAbi_quoteLeaveSushiBar,
    functionName: 'quoteLeaveSushiBar',
    args: amount ? [amount.amount] : undefined,
    query: { enabled },
  })

  return useMemo(
    () => ({
      ...readContractResponse,
      data: readContractResponse?.data
        ? new Amount(SUSHI[EvmChainId.ETHEREUM], readContractResponse.data)
        : undefined,
    }),
    [readContractResponse],
  )
}
