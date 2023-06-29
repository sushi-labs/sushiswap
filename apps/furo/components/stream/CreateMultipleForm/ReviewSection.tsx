import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, tryParseAmount, Type } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { usePrices } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/components/currency'
import { List } from '@sushiswap/ui/components/list/List'
import { Table } from '@sushiswap/ui/components/table'
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

  const amounts = useMemo(() => (_streams || []).map((el) => el.amount), [_streams])
  const tokens = useMemo(() => (_streams || []).map((el) => el.currency), [_streams])

  const _tokens = useTokensFromZTokens(tokens)
  const _amounts = useMemo(() => {
    return amounts.map((el, index) => tryParseAmount(el, _tokens[index]))
  }, [_tokens, amounts])

  const summedAmounts = useMemo(
    () =>
      Object.values(
        _amounts.reduce<Record<string, Amount<Type>>>((acc, cur) => {
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
    [_amounts]
  )

  if (!isValid) return <></>

  return (
    <div className="flex flex-col gap-4">
      <List>
        <List.Label>Funds</List.Label>
        <List.Control>
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
        </List.Control>
      </List>
      <List>
        <List.Label>Recipients</List.Label>
        <List.Control>
          <Table.container>
            <Table.table>
              <Table.thead>
                <Table.thr>
                  <Table.th className="text-left">Recipient</Table.th>
                  <Table.th className="text-left">Token</Table.th>
                  <Table.th className="text-left">Total Amount</Table.th>
                  <Table.th className="text-left">Start Date</Table.th>
                  <Table.th className="text-left">End Date</Table.th>
                </Table.thr>
              </Table.thead>
              <Table.tbody>
                {streams?.map((el, idx) => {
                  const amount = _amounts[idx]
                  return (
                    <Table.tr key={idx}>
                      <Table.td>
                        {el.recipient && isAddress(el.recipient) && (
                          <a
                            rel="noreferrer"
                            target="_blank"
                            className="flex items-center gap-1 text-blue hover:underline-none hover:text-blue-700"
                            href={Chain.from(chainId)?.getAccountUrl(el.recipient)}
                          >
                            {shortenAddress(el.recipient)} <ExternalLinkIcon width={16} height={16} />
                          </a>
                        )}
                      </Table.td>
                      <Table.td>{amount?.currency.symbol}</Table.td>
                      <Table.td>
                        {amount?.toSignificant(6)} {amount?.currency.symbol}
                      </Table.td>
                      <Table.td>
                        {el.dates?.startDate ? format(el.dates.startDate, 'dd MMM yyyy hh:mmaaa') : 'Not available'}
                      </Table.td>
                      <Table.td>
                        {el.dates?.endDate ? format(el.dates.endDate, 'dd MMM yyyy hh:mmaaa') : 'Not available'}
                      </Table.td>
                    </Table.tr>
                  )
                })}
              </Table.tbody>
            </Table.table>
          </Table.container>
        </List.Control>
      </List>
    </div>
  )
}
