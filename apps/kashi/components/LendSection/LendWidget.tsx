import { tryParseAmount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Button, Dialog, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { Widget } from '@sushiswap/ui/widget'
import { Approve, usePrices, Web3Input } from '@sushiswap/wagmi'
import { getV2RouterContractConfig } from '@sushiswap/wagmi/hooks/useV2Router'
import { FC, useCallback, useMemo, useState } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'
import { useCustomTokens } from '../../lib/state/storage'
import { useTokens } from '../../lib/state/token-lists'

interface LendWidget {
  pair: KashiPair
}

export const LendWidget: FC<LendWidget> = ({ pair }) => {
  const { asset } = useTokensFromKashiPair(pair)
  const [value, setValue] = useState('')
  const valueAsEntity = useMemo(() => tryParseAmount(value, asset), [asset, value])
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(pair.chainId)
  const tokenMap = useTokens(pair.chainId)
  const [review, setReview] = useState(false)
  const { data: prices } = usePrices({ chainId: pair.chainId })

  const execute = useCallback(() => {}, [])

  return (
    <>
      <Widget id="depositCollateral" maxWidth="md">
        <Widget.Content>
          <Widget.Header title="Deposit" />
          <Web3Input.Currency
            className="p-3"
            loading={false}
            value={value}
            onChange={setValue}
            currency={asset}
            customTokenMap={customTokensMap}
            onAddToken={addCustomToken}
            onRemoveToken={removeCustomToken}
            chainId={pair.chainId}
            tokenMap={tokenMap}
          />
          <div className="p-3">
            <Button fullWidth disabled={!value} onClick={() => setReview(true)}>
              {!value ? 'Enter Amount' : 'Review'}
            </Button>
          </div>
        </Widget.Content>
      </Widget>
      <Dialog open={review} onClose={() => setReview(false)}>
        <Dialog.Content className="max-w-sm !pb-4">
          <Dialog.Header border={false} title="Confirm Deposit" onClose={() => setReview(false)} />
          <div className="!my-0 grid grid-cols-12 items-center">
            <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography variant="h3" weight={500} className="truncate text-slate-50">
                    {valueAsEntity?.toSignificant(6)}{' '}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {valueAsEntity && (
                      <div className="w-5 h-5">
                        <Icon currency={valueAsEntity.currency} width={20} height={20} />
                      </div>
                    )}
                    <Typography variant="h3" weight={500} className="text-right text-slate-50">
                      {valueAsEntity?.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="sm" weight={500} className="text-slate-500">
                {valueAsEntity && prices?.[asset.wrapped.address]
                  ? formatUSD(valueAsEntity?.multiply(prices?.[asset.wrapped.address].asFraction).toFixed(2))
                  : '-'}
              </Typography>
            </div>
            {/*<div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">*/}
            {/*  <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">*/}
            {/*    <PlusIcon width={18} height={18} className="text-slate-200" />*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <div className="flex items-center justify-between w-full gap-2">*/}
            {/*      <Typography variant="h3" weight={500} className="truncate text-slate-50">*/}
            {/*        {parsedInput1?.toSignificant(6)}{' '}*/}
            {/*      </Typography>*/}
            {/*      <div className="flex items-center justify-end gap-2 text-right">*/}
            {/*        {parsedInput1 && (*/}
            {/*          <div className="w-5 h-5">*/}
            {/*            <Icon currency={parsedInput1.currency} width={20} height={20} />*/}
            {/*          </div>*/}
            {/*        )}*/}
            {/*        <Typography variant="h3" weight={500} className="text-right text-slate-50">*/}
            {/*          {parsedInput1?.currency.symbol}*/}
            {/*        </Typography>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          <Approve
            className="flex-grow !justify-end mt-3"
            components={
              <Approve.Components>
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={valueAsEntity}
                  address={getV2RouterContractConfig(pair.chainId).addressOrName}
                />
              </Approve.Components>
            }
            render={({ approved }) => {
              return (
                <Button size="md" disabled={!approved} fullWidth color="gradient" onClick={execute}>
                  Confirm Deposit
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
