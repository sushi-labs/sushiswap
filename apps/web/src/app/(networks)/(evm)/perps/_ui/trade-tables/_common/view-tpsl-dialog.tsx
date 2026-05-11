import {
  Card,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  type OrderHistoryItemType,
  type UserOpenOrdersItemType,
  getTextColorClass,
  perpsNumberFormatter,
} from 'src/lib/perps'
import { PerpsCard, TableButton } from '../../_common'

function getLetterFromIndex(index: number): string {
  return String.fromCharCode(97 + index).toUpperCase() // 97 = 'A'
}

export const ViewTpSlDialog = ({
  tpSlChildren,
  assetSymbol,
}: {
  tpSlChildren: UserOpenOrdersItemType[] | OrderHistoryItemType['order'][]
  assetSymbol: string
}) => {
  const ogOrder = tpSlChildren?.[0]
  const tpSlOrders = tpSlChildren?.slice(1) ?? []

  const orderText = useMemo(() => {
    const tpSlOrdersCount = tpSlOrders?.length
    return `If order ${getLetterFromIndex(0)} is filled, order${tpSlOrdersCount > 1 ? 's' : ''} ${tpSlOrders?.map((_, idx) => getLetterFromIndex(idx + 1)).join(' and ')} will be placed.`
  }, [tpSlOrders])

  return (
    <PerpsDialog>
      <PerpsDialogTrigger asChild>
        <TableButton>View</TableButton>
      </PerpsDialogTrigger>
      <PerpsDialogContent className="!max-w-3xl">
        <PerpsDialogHeader>
          <PerpsDialogTitle>Take Profit/Stop Loss</PerpsDialogTitle>
          <PerpsDialogDescription>
            View the take profit and stop loss orders associated with this open
            order.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent className="text-sm">
          <div>
            <p className="mt-2 text-center mb-4">{orderText}</p>
            <p className="text-muted-foreground text-center mb-2">
              Order {getLetterFromIndex(0)}
            </p>
            <_OrderCard
              tpSlOrder={ogOrder}
              assetSymbol={assetSymbol}
              isMarketPrice={ogOrder.orderType.includes('Market')}
              price={ogOrder.limitPx}
            />
            <div className="h-16 min-h-16 w-[1px] mt-2 mx-auto bg-muted-foreground" />
          </div>
          <div
            className={classNames(
              'grid grid-cols-2 gap-2',
              tpSlOrders?.length <= 1 ? 'mt-4' : '',
            )}
          >
            {tpSlOrders?.map((tpSlOrder, idx) => {
              const isMarketPrice = tpSlOrder.orderType.includes('Market')
              const price = tpSlOrder.limitPx
              return (
                <div
                  key={`${tpSlOrder.oid}-${idx}`}
                  className={classNames(
                    'w-full',
                    tpSlOrders.length === 1 ? 'col-span-2' : 'col-span-1',
                  )}
                >
                  {tpSlOrders.length > 1 ? (
                    <p className="mt-2 text-muted-foreground text-center mb-4">
                      If Order {getLetterFromIndex(idx + 1)} filled, cancel
                      Order {getLetterFromIndex(idx === 0 ? idx + 2 : idx)}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground text-center mb-2">
                    Order {getLetterFromIndex(idx + 1)}
                  </p>
                  <_OrderCard
                    tpSlOrder={tpSlOrder}
                    assetSymbol={assetSymbol}
                    isMarketPrice={isMarketPrice}
                    price={price}
                  />
                </div>
              )
            })}
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}

const _OrderCard = ({
  tpSlOrder,
  assetSymbol,
  isMarketPrice,
  price,
}: {
  tpSlOrder: UserOpenOrdersItemType | OrderHistoryItemType['order']
  assetSymbol: string
  isMarketPrice: boolean
  price: string
}) => {
  return (
    <PerpsCard className="p-3">
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Type</span>
          <span className="font-medium">{tpSlOrder.orderType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Side</span>
          <span
            className={classNames(
              'font-medium',
              getTextColorClass(tpSlOrder.side === 'A' ? -1 : 1),
            )}
          >
            {tpSlOrder.side === 'A' ? 'Short' : 'Long'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">
            {perpsNumberFormatter({ value: tpSlOrder.sz, maxFraxDigits: 8 })}{' '}
            {assetSymbol}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Trigger</span>
          <span className="font-medium">{tpSlOrder.triggerCondition}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price</span>
          <span className="font-medium">
            {isMarketPrice
              ? 'Market'
              : perpsNumberFormatter({ value: price, maxFraxDigits: 8 })}
          </span>
        </div>
      </div>
    </PerpsCard>
  )
}
