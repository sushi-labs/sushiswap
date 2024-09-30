import { useMutation } from '@tanstack/react-query'

interface UseApplyForTokenListParams {
  chainId: number
  listType: string
  logoFile: string
  tokenDecimals: number
  tokenAddress: string
  tokenSymbol: string
  tokenName?: string
}

export const useApplyForTokenList = () => {
  return useMutation({
    mutationFn: async ({
      chainId,
      listType,
      tokenAddress,
      tokenSymbol,
      tokenName,
      tokenDecimals,
      logoFile,
    }: UseApplyForTokenListParams) => {
      const data = await fetch('/tokenlist-request/api/submit', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          tokenAddress,
          tokenSymbol,
          tokenName,
          tokenDecimals,
          logoFile,
          chainId,
          listType,
        }),
      })

      const json = await data.json()

      if (data.status !== 200) throw new Error(json.error)

      return json
    },
  })
}
