import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { Amount, tryParseAmount, Type } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { Button, Currency, Link, Table, Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/react-query'
import { format } from 'date-fns'
import React, { FC, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { useDeepCompareMemoize } from '../../../lib'
import { useTokensFromZTokens } from '../../../lib/zod'
import { CreateMultipleStreamFormSchemaType } from './schema'

interface ReviewSection {
  chainId: ChainId
  onBack(): void
}

export const ReviewSection: FC<ReviewSection> = ({ chainId, onBack }) => {
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-3">
          <Typography variant="h3" className="text-slate-50" weight={500}>
            Review Streams
          </Typography>
          <Typography variant="sm" className="text-slate-400" weight={500}>
            Created streams can be cancelled anytime by the owner of the stream.
          </Typography>
        </div>

        <div className="flex flex-col gap-4">
          <Typography variant="sm" weight={500} className="text-slate-400">
            Funds being used for streaming
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
          </Typography>{' '}
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
                          <Link.External
                            className="flex items-center gap-1 text-blue hover:underline-none hover:text-blue-400"
                            href={Chain.from(chainId)?.getAccountUrl(el.recipient)}
                          >
                            {shortenAddress(el.recipient)} <ExternalLinkIcon width={16} height={16} />
                          </Link.External>
                        )}
                      </Table.td>
                      <Table.td>{amount?.currency.symbol}</Table.td>
                      <Table.td>
                        {amount?.toSignificant(6)} {amount?.currency.symbol}
                      </Table.td>
                      <Table.td>
                        {el.dates?.startDate ? (
                          <Typography variant="sm" className="text-slate-50" weight={500}>
                            {format(el.dates.startDate, 'dd MMM yyyy hh:mmaaa')}
                          </Typography>
                        ) : (
                          <Typography variant="sm" className="italic text-slate-500">
                            Not available
                          </Typography>
                        )}
                      </Table.td>
                      <Table.td>
                        {el.dates?.endDate ? (
                          <Typography variant="sm" className="text-slate-50" weight={500}>
                            {format(el.dates.endDate, 'dd MMM yyyy hh:mmaaa')}
                          </Typography>
                        ) : (
                          <Typography variant="sm" className="italic text-slate-500">
                            Not available
                          </Typography>
                        )}
                      </Table.td>
                    </Table.tr>
                  )
                })}
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
