import { getPortfolioHistory } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PortfolioApproveTransaction } from './PortfolioApproveTransaction'
import { PortfolioOtherTransaction } from './PortfolioOtherTransaction'
import { PortfolioReceiveTransaction } from './PortfolioReceiveTransaction'
import { PortfolioSendTransaction } from './PortfolioSendTransaction'

function usePortfolioHistory(
  address: Address | undefined,
  refetchInterval?: 600_000,
) {
  return useQuery({
    queryKey: ['portfolio-history', address],
    queryFn: async () => {
      const id = address as string
      const data = await getPortfolioHistory({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

export const PortfolioHistory = () => {
  const { address } = useAccount()
  const { data } = usePortfolioHistory(address)

  return (
    <div className="flex flex-col gap-y-5 h-full overflow-hidden">
      <div className="overflow-y-auto h-full cursor-default">
        {data?.map((tx) =>
          tx.category === 'APPROVE' ? (
            <PortfolioApproveTransaction tx={tx} />
          ) : tx.category === 'SEND' ? (
            <PortfolioSendTransaction tx={tx} />
          ) : tx.category === 'RECEIVE' ? (
            <PortfolioReceiveTransaction tx={tx} />
          ) : (
            <PortfolioOtherTransaction tx={tx} />
          ),
        )}
      </div>
    </div>
  )
}
