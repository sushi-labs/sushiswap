import { AddressZero } from '@ethersproject/constants'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { ExternalLinkIcon, TableIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, tryParseAmount, Type } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { Button, Currency, IconButton, Link as UILink, Table, Tooltip, Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/react-query'
import { format } from 'date-fns'
import React, { FC, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../lib'
import { useTokenFromZToken } from '../../../lib/zod'
import { CreateVestingFormSchemaType, ScheduleReview } from '../CreateForm'
import { createScheduleRepresentation } from '../createScheduleRepresentation'
import { calculateEndDate, calculateTotalAmount } from '../utils'
import { CreateMultipleVestingModelSchemaType } from './schema'

interface ReviewSection {
  chainId: ChainId
  onBack(): void
}

export const ReviewSection: FC<ReviewSection> = ({ chainId, onBack }) => {
  const { data: prices } = usePrices({ chainId })
  const {
    watch,
    formState: { isValid },
  } = useFormContext<CreateMultipleVestingModelSchemaType>()

  // Watch mutates the same object which means effects do not trigger when you're watching an array
  const vestings = watch('vestings')
  const _vestings = useDeepCompareMemoize(vestings)

  const amounts = useMemo(() => {
    if (!_vestings) return []
    return _vestings.map(calculateTotalAmount)
  }, [_vestings])

  const summedAmounts = useMemo(
    () =>
      Object.values(
        amounts.reduce<Record<string, Amount<Type>>>((acc, cur) => {
          if (!cur) return acc
          const address = cur.currency.isNative ? AddressZero : cur.currency.address
          if (acc[address]) {
            acc[address] = acc[address].add(cur)
          } else {
            acc[address] = cur
          }
          return acc
        }, {})
      ),
    [amounts]
  )

  if (!isValid) return <></>

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-3">
          <Typography variant="h3" className="text-slate-50" weight={500}>
            Review Vests
          </Typography>
          <Typography variant="sm" className="text-slate-400" weight={500}>
            Created vests can be cancelled anytime by the owner of the stream.
          </Typography>
        </div>

        <div className="flex flex-col gap-4">
          <Typography variant="sm" weight={500} className="text-slate-400">
            Funds being used for vests
          </Typography>
          <Table.container>
            <Table.table>
              <Table.thead>
                <Table.thr>
                  <Table.th className="text-left">Token</Table.th>
                  <Table.th className="text-left">Amount</Table.th>
                  <Table.th className="text-left">Value</Table.th>
                </Table.thr>
              </Table.thead>
              <Table.tbody>
                {summedAmounts.map((el, idx) => (
                  <Table.tr key={idx}>
                    <Table.td className="flex items-center gap-2">
                      <Currency.Icon currency={el.currency} width={20} height={20} />
                      {el.currency.symbol}
                    </Table.td>
                    <Table.td>
                      {el.toSignificant(6)} {el.currency.symbol}
                    </Table.td>
                    <Table.td>
                      {prices && prices?.[el.currency.wrapped.address]
                        ? `$${el.multiply(prices[el.currency.wrapped.address].asFraction).toFixed(2)}`
                        : '-'}
                    </Table.td>
                  </Table.tr>
                ))}
              </Table.tbody>
            </Table.table>
          </Table.container>
        </div>
        <div className="flex flex-col gap-4">
          <Typography variant="sm" weight={500} className="text-slate-400">
            Recipient list
          </Typography>
          <Table.container>
            <Table.table>
              <Table.thead>
                <Table.thr>
                  <Table.th className="text-left">Recipient</Table.th>
                  <Table.th className="text-left">Token</Table.th>
                  <Table.th className="text-left">Total Amount</Table.th>
                  <Table.th className="text-left">End Date</Table.th>
                  <Table.th className="text-left">Vesting Schedule</Table.th>
                </Table.thr>
              </Table.thead>
              <Table.tbody>
                {vestings?.map(
                  (
                    { id, cliff, currency, recipient, startDate, stepPayouts, stepConfig, stepAmount, fundSource },
                    idx
                  ) => (
                    <TableRow
                      id={id}
                      key={idx}
                      currency={currency}
                      chainId={chainId}
                      cliff={cliff}
                      recipient={recipient}
                      stepPayouts={stepPayouts}
                      stepConfig={stepConfig}
                      startDate={startDate}
                      stepAmount={stepAmount}
                      fundSource={fundSource}
                    />
                  )
                )}
              </Table.tbody>
            </Table.table>
          </Table.container>
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="empty" className="flex items-center gap-1 whitespace-nowrap" onClick={onBack}>
          <ArrowLeftIcon width={16} height={16} /> Go Back and Edit
        </Button>
      </div>
    </div>
  )
}

const TableRow: FC<CreateVestingFormSchemaType & { chainId: ChainId }> = ({
  currency,
  chainId,
  recipient,
  cliff,
  stepAmount,
  stepPayouts,
  stepConfig,
  startDate,
}) => {
  const _currency = useTokenFromZToken(currency)
  const totalAmount = calculateTotalAmount({
    currency,
    cliff,
    stepAmount,
    stepPayouts,
  })
  const endDate = calculateEndDate({
    cliff,
    startDate,
    stepPayouts,
    stepConfig,
  })
  const [_cliffAmount, _stepAmount] = useMemo(() => {
    return [
      cliff.cliffEnabled ? tryParseAmount(cliff.cliffAmount?.toString(), _currency) : undefined,
      tryParseAmount(stepAmount?.toString(), _currency),
    ]
  }, [cliff.cliffEnabled, _currency, stepAmount])

  return (
    <Table.tr>
      <Table.td>
        {recipient && (
          <UILink.External
            className="flex items-center gap-1 text-blue hover:underline-none hover:text-blue-400"
            href={Chain.from(chainId)?.getAccountUrl(recipient) ?? ''}
          >
            {shortenAddress(recipient)} <ExternalLinkIcon width={16} height={16} />
          </UILink.External>
        )}
      </Table.td>
      <Table.td>{currency?.symbol}</Table.td>
      <Table.td>
        {totalAmount?.toSignificant(6)} {totalAmount?.currency.symbol}
      </Table.td>
      <Table.td>
        {endDate ? (
          <Typography variant="sm" className="text-slate-50" weight={500}>
            {format(endDate, 'dd MMM yyyy hh:mmaaa')}
          </Typography>
        ) : (
          <Typography variant="sm" className="italic text-slate-500">
            Not available
          </Typography>
        )}
      </Table.td>
      <Table.td className="flex items-center gap-2">
        {cliff.cliffEnabled ? `Cliff, ${stepConfig?.label}` : stepConfig.label}
        <Tooltip
          button={
            <IconButton as="div">
              <TableIcon width={16} height={16} />
            </IconButton>
          }
          panel={
            currency && stepPayouts ? (
              <div className="p-1 bg-slate-800">
                {_stepAmount && _currency && stepConfig && startDate && stepPayouts && (
                  <ScheduleReview
                    currency={_currency}
                    schedule={createScheduleRepresentation({
                      currency: _currency,
                      cliffAmount: _cliffAmount,
                      stepAmount: _stepAmount,
                      stepDuration: stepConfig.time * 1000,
                      startDate,
                      cliffEndDate: cliff.cliffEnabled ? cliff?.cliffEndDate : null,
                      stepPayouts,
                    })}
                  />
                )}
              </div>
            ) : (
              <div />
            )
          }
        />
      </Table.td>
    </Table.tr>
  )
}
