import { useMemo } from 'react'
import { YOJIMBO_ADDRESS, yojimboAbi_quoteEnterSushiBar } from 'src/lib/stake'
import { Amount } from 'sushi'
import { EvmChainId, type EvmToken, XSUSHI } from 'sushi/evm'
import { useReadContract } from 'wagmi'

export const useQuoteBarDeposit = ({
  amount,
  enabled = true,
}: { amount: Amount<EvmToken> | undefined; enabled?: boolean }) => {
  const readContractResponse = useReadContract({
    chainId: EvmChainId.ETHEREUM,
    address: YOJIMBO_ADDRESS,
    abi: yojimboAbi_quoteEnterSushiBar,
    functionName: 'quoteEnterSushiBar',
    args: amount ? [amount.amount] : undefined,
    query: { enabled },
  })

  return useMemo(
    () => ({
      ...readContractResponse,
      data: readContractResponse?.data
        ? new Amount(XSUSHI[EvmChainId.ETHEREUM], readContractResponse.data)
        : undefined,
    }),
    [readContractResponse],
  )
}
