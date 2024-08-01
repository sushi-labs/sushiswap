import { StatusResponse } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'
import { SquidApiURL, SquidIntegratorId } from 'sushi/config'

export const getSquidStatus = async (
  txHash: string,
): Promise<StatusResponse> => {
  const url = new URL(`${SquidApiURL}/status`)
  url.searchParams.set('transactionId', txHash)

  const response = await fetch(url, {
    headers: {
      'x-integrator-id': SquidIntegratorId,
    },
  })

  const json = await response.json()

  return json
}

export const useAxelarScanLink = ({
  tradeId,
  network0,
  network1,
  txHash,
  enabled,
}: {
  tradeId: string
  network0: ChainId
  network1: ChainId
  txHash: string | undefined
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['axelarScanLink', { txHash, network0, network1, tradeId }],
    queryFn: async () => {
      if (txHash) {
        return getSquidStatus(txHash).then((data) => ({
          link: data.axelarTransactionUrl,
          status: data.squidTransactionStatus,
          dstTxHash: data.toChain?.transactionId,
        }))
      }

      return {
        link: undefined,
        status: undefined,
        dstTxHash: undefined,
      }
    },
    refetchInterval: 2000,
    enabled: enabled && !!txHash,
  })
}
