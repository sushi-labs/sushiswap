import { Link } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { useParams } from 'next/navigation'
import { FC } from 'react'

interface PoolButtonsProps {}

export const PoolButtons: FC<PoolButtonsProps> = ({}) => {
  const router = useParams()
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Link.Internal href={`/pool/${router?.id}/remove`} passHref={true}>
          <a className="w-full">
            <Button disabled={Boolean()} size="lg" color="default" fullWidth>
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
    </div>
  )
}
