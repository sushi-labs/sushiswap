import { Link } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { useParams } from 'next/navigation'
import { FC } from 'react'

interface PoolButtonsProps {
  isFarm: boolean
}

export const PoolButtons: FC<PoolButtonsProps> = ({ isFarm }) => {
  const router = useParams()
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Link.Internal href={`/pool/${decodeURIComponent(router?.id)}/remove`} passHref={true}>
          <a className="w-full">
            <Button size="lg" color="default" fullWidth>
              Withdraw
            </Button>
          </a>
        </Link.Internal>
        <Link.Internal href={`/pool/add`} passHref={true}>
          <Button as="a" size="lg" fullWidth>
            Deposit
          </Button>
        </Link.Internal>
      </div>
      <Button className="col-span-2" size="lg" color="default" as="a" href={`/swap`}>
        Trade
      </Button>
      {isFarm && (
        <Link.Internal href={`/pool/${decodeURIComponent(router?.id)}/stake`}>
          <Button className="col-span-2" size="lg" color="default">
            Stake Liquidity
          </Button>
        </Link.Internal>
      )}
    </div>
  )
}
