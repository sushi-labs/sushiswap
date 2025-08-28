import { Button, classNames } from '@sushiswap/ui'
import Link from 'next/link'
import { evmChains } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { SendWidget } from '../wallet-holdings/send-widget'
import { TradeModal } from '../wallet-holdings/trade-modal'

interface ActionButtonsProps {
  token: Type
  splitRows?: boolean
  renderSendWidget?: boolean
  className?: string
  buttonClassName?: string
}

export const ActionButtons = ({
  token,
  splitRows = false,
  renderSendWidget = true,
  className = '',
  buttonClassName = '',
}: ActionButtonsProps) => {
  const baseBtnClasses =
    'text-slate-50 !rounded-full font-semibold min-h-[32px] h-[32px] px-2 text-xs flex items-center justify-center'
  const fixedWidth = splitRows ? '!w-[93px]' : 'w-full md:w-[64px]'

  const firstRow = (
    <>
      <TradeModal
        token={token}
        side="buy"
        triggerClassName={classNames(fixedWidth, buttonClassName)}
      />
      <TradeModal
        token={token}
        side="sell"
        triggerClassName={classNames(fixedWidth, buttonClassName)}
      />
      <Link
        href={`/${evmChains[token.chainId].name.toLowerCase()}/explore/pools?tokenSymbols=${token.symbol}`}
        className={classNames(
          'bg-blue-500',
          baseBtnClasses,
          fixedWidth,
          buttonClassName,
        )}
      >
        Earn
      </Link>
    </>
  )

  const secondRow = (
    <>
      {renderSendWidget && (
        <SendWidget
          triggerClassName={classNames(
            fixedWidth,
            '!min-h-[32px] !h-[32px] !p-2 text-xs !rounded-full !bg-[#0000001F] dark:!bg-[#FFFFFF1F] !text-slate-900 dark:!text-slate-100',
            buttonClassName,
          )}
          hideTriggerIcon
          initialToken={token}
        />
      )}
      {splitRows && (
        <Link
          href={`#`}
          className={classNames(
            'bg-blue-500',
            baseBtnClasses,
            fixedWidth,
            buttonClassName,
          )}
        >
          More
        </Link>
      )}
    </>
  )

  return splitRows ? (
    <div className="flex relative z-10 flex-col gap-4">
      <div className="flex gap-2 justify-center">{firstRow}</div>
      <div className="flex gap-2 justify-center">{secondRow}</div>
    </div>
  ) : (
    <div
      className={classNames(
        'grid relative z-10 grid-cols-2 col-span-2 gap-2 md:flex md:flex-row md:justify-center md:items-center md:col-span-2',
        className,
      )}
    >
      {firstRow}
      {secondRow}
    </div>
  )
}
