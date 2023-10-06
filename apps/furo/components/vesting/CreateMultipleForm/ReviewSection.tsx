import { AddressZero } from '@ethersproject/constants'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from 'sushi/chain'
import { Amount, Type } from 'sushi/currency'
import { shortenAddress } from 'sushi'
import { usePrices } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/components/currency'
import { List } from '@sushiswap/ui/components/list/List'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@sushiswap/ui/components/table'
import { format } from 'date-fns'
import React, { FC, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../lib'
import {
  CreateMultipleVestingFormSchemaType,
  CreateVestingFormSchemaType,
} from '../schema'
import { calculateEndDate, calculateTotalAmount } from '../utils'

interface ReviewSection {
  chainId: ChainId
}

export const ReviewSection: FC<ReviewSection> = ({ chainId }) => {
  const { data: prices } = usePrices({ chainId })
  const {
    watch,
    formState: { isValid },
  } = useFormContext<CreateMultipleVestingFormSchemaType>()

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
          const address = cur.currency.isNative
            ? AddressZero
            : cur.currency.address
          if (acc[address]) {
            acc[address] = acc[address].add(cur)
          } else {
            acc[address] = cur
          }
          return acc
        }, {}),
      ),
    [amounts],
  )

  if (!isValid) return <></>

  return (
    <div className="flex flex-col gap-14">
      <List>
        <List.Label>Funds</List.Label>
        <List.Control>
          <Table>
            <TableHeader>
              <TableHead className="text-left">Token</TableHead>
              <TableHead className="text-left">Amount</TableHead>
              <TableHead className="text-left">Value</TableHead>
            </TableHeader>
            <TableBody>
              {summedAmounts.map((el, idx) => (
                <TableRow key={idx}>
                  <TableCell className="flex items-center gap-2">
                    <Currency.Icon
                      currency={el.currency}
                      width={20}
                      height={20}
                    />
                    {el.currency.symbol}
                  </TableCell>
                  <TableCell>
                    {el.toSignificant(6)} {el.currency.symbol}
                  </TableCell>
                  <TableCell>
                    {prices && prices?.[el.currency.wrapped.address]
                      ? `$${el
                          .multiply(
                            prices[el.currency.wrapped.address].asFraction,
                          )
                          .toFixed(2)}`
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </List.Control>
      </List>
      <List>
        <List.Label>Recipients</List.Label>
        <List.Control>
          <Table>
            <TableHeader>
              <TableHead className="text-left">Recipient</TableHead>
              <TableHead className="text-left">Token</TableHead>
              <TableHead className="text-left">Total Amount</TableHead>
              <TableHead className="text-left">End Date</TableHead>
              <TableHead className="text-left">Vesting Schedule</TableHead>
            </TableHeader>
            <TableBody>
              {vestings?.map(
                (
                  {
                    id,
                    cliffEndDate,
                    cliffAmount,
                    cliffEnabled,
                    currency,
                    recipient,
                    startDate,
                    stepPayouts,
                    stepConfig,
                    stepAmount,
                    fundSource,
                  },
                  idx,
                ) => (
                  <_TableRow
                    id={id}
                    key={idx}
                    currency={currency}
                    chainId={chainId}
                    cliffEnabled={cliffEnabled}
                    cliffAmount={cliffAmount}
                    cliffEndDate={cliffEndDate}
                    recipient={recipient}
                    stepPayouts={stepPayouts}
                    stepConfig={stepConfig}
                    startDate={startDate}
                    stepAmount={stepAmount}
                    fundSource={fundSource}
                  />
                ),
              )}
            </TableBody>
          </Table>
        </List.Control>
      </List>
    </div>
  )
}

const _TableRow: FC<CreateVestingFormSchemaType & { chainId: ChainId }> = ({
  currency,
  chainId,
  recipient,
  cliffEnabled,
  cliffAmount,
  cliffEndDate,
  stepAmount,
  stepPayouts,
  stepConfig,
  startDate,
}) => {
  const totalAmount = calculateTotalAmount({
    currency,
    cliffEnabled,
    cliffAmount,
    stepAmount,
    stepPayouts,
  })
  const endDate = calculateEndDate({
    cliffEnabled,
    cliffEndDate,
    startDate,
    stepPayouts,
    stepConfig,
  })

  return (
    <TableRow>
      <TableCell>
        {recipient && (
          <a
            rel="noreferrer"
            target="_blank"
            className="flex items-center gap-1 text-blue hover:underline-none hover:text-blue-700"
            href={Chain.from(chainId)?.getAccountUrl(recipient) ?? ''}
          >
            {shortenAddress(recipient)}{' '}
            <ExternalLinkIcon width={16} height={16} />
          </a>
        )}
      </TableCell>
      <TableCell>{currency?.symbol}</TableCell>
      <TableCell>
        {totalAmount?.toSignificant(6)} {totalAmount?.currency.symbol}
      </TableCell>
      <TableCell>
        {endDate && !isNaN(+endDate)
          ? format(endDate, 'dd MMM yyyy hh:mmaaa')
          : 'Not available'}
      </TableCell>
      <TableCell className="flex items-center gap-2">
        {cliffEnabled ? `Cliff, ${stepConfig}` : stepConfig}
      </TableCell>
    </TableRow>
  )
}
