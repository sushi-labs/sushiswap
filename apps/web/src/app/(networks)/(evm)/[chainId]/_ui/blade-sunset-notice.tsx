import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Button, LinkInternal, Message, classNames } from '@sushiswap/ui'
import { type EvmChainId, getEvmChainById, isBladeChainId } from 'sushi/evm'

export const BladeSunsetNotice = ({
  className,
  includeCtaBtn = true,
  chainId,
}: { className?: string; includeCtaBtn?: boolean; chainId?: EvmChainId }) => {
  return (
    <Message className={classNames(className ?? '')}>
      <p className="font-bold">Blade Pools Notice:</p>
      <p>
        Blade pools are being paused until further notice and are now withdrawal
        only. Please withdraw any funds from Blade pools and migrate to V3
        concentrated liquidity pools to continue earning fees.
      </p>
      {includeCtaBtn ? (
        <LinkInternal
          href={`/${chainId && isBladeChainId(chainId) ? getEvmChainById(chainId).key : 'ethereum'}/pool?tab=blade`}
        >
          <Button
            className="mt-4"
            iconPosition="end"
            iconProps={{ className: '!w-4 !h-4' }}
            icon={ArrowUpRightIcon}
          >
            View Open Positions
          </Button>
        </LinkInternal>
      ) : null}
    </Message>
  )
}
