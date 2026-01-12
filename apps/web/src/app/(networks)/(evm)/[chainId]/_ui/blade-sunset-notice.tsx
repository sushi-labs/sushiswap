import { Button, LinkInternal, Message, classNames } from '@sushiswap/ui'
import { ArrowUpRight } from '@sushiswap/ui/icons/ArrowUpRight'
import { type EvmChainId, getEvmChainById, isBladeChainId } from 'sushi/evm'

export const BladeSunsetNotice = ({
  className,
  includeCtaBtn = true,
  chainId,
}: { className?: string; includeCtaBtn?: boolean; chainId?: EvmChainId }) => {
  return (
    <Message className={classNames(className ?? '')}>
      <p className="font-bold">Sunsetting Notice:</p>
      <p>
        Blade Pools are being sunset and are now in withdrawal-only mode. New
        deposits are disabled - please withdraw your funds and migrate to
        supported pools.{' '}
      </p>
      {includeCtaBtn ? (
        <LinkInternal
          href={`/${chainId && isBladeChainId(chainId) ? getEvmChainById(chainId).key : 'ethereum'}/pool?tab=blade`}
        >
          <Button
            className="mt-4"
            iconPosition="end"
            iconProps={{ className: '!w-3 !h-3' }}
            icon={ArrowUpRight}
          >
            View Open Positions
          </Button>
        </LinkInternal>
      ) : null}
    </Message>
  )
}
