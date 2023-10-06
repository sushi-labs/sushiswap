import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from 'sushi/chain'
import { Amount, tryParseAmount, Type } from 'sushi/currency'
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
import { useTokensFromZTokens } from '../../../lib/zod'
import { CreateMultipleStreamFormSchemaType } from '../schema'

interface ReviewSection {
  chainId: ChainId
}

export const ReviewSection: FC<ReviewSection> = ({ chainId }) => {
  const { data: prices } = usePrices({ chainId })
  const {
    watch,
    formState: { isValid },
  } = useFormContext<CreateMultipleStreamFormSchemaType>()

  // Watch mutates the same object which means effects do not trigger when you're watching an array
  const streams = watch('streams')
  const _streams = useDeepCompareMemoize(streams)

  const amounts = useMemo(
    () => (_streams || []).map((el) => el.amount),
    [_streams],
  )
  const tokens = useMemo(
    () => (_streams || []).map((el) => el.currency),
    [_streams],
  )

  const _tokens = useTokensFromZTokens(tokens)
  const _amounts = useMemo(() => {
    return amounts.map((el, index) => tryParseAmount(el, _tokens[index]))
  }, [_tokens, amounts])

  const summedAmounts = useMemo(
    () =>
      Object.values(
        _amounts.reduce<Record<string, Amount<Type>>>((acc, cur) => {
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
    [_amounts],
  )

  if (!isValid) return <></>

  return (
    <div className="flex flex-col gap-4">
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
              <TableHead className="text-left">Start Date</TableHead>
              <TableHead className="text-left">End Date</TableHead>
            </TableHeader>
            <TableBody>
              {streams?.map((el, idx) => {
                const amount = _amounts[idx]
                return (
                  <TableRow key={idx}>
                    <TableCell>
                      {el.recipient && isAddress(el.recipient) && (
                        <a
                          rel="noreferrer"
                          target="_blank"
                          className="flex items-center gap-1 text-blue hover:underline-none hover:text-blue-700"
                          href={Chain.from(chainId)?.getAccountUrl(
                            el.recipient,
                          )}
                        >
                          {shortenAddress(el.recipient)}{' '}
                          <ExternalLinkIcon width={16} height={16} />
                        </a>
                      )}
                    </TableCell>
                    <TableCell>{amount?.currency.symbol}</TableCell>
                    <TableCell>
                      {amount?.toSignificant(6)} {amount?.currency.symbol}
                    </TableCell>
                    <TableCell>
                      {el.dates?.startDate
                        ? format(el.dates.startDate, 'dd MMM yyyy hh:mmaaa')
                        : 'Not available'}
                    </TableCell>
                    <TableCell>
                      {el.dates?.endDate
                        ? format(el.dates.endDate, 'dd MMM yyyy hh:mmaaa')
                        : 'Not available'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </List.Control>
      </List>
    </div>
  )
}
