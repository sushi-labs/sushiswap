import { Switch } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import ExternalLink from 'app/components/ExternalLink'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import { Auction } from 'app/features/miso/context/Auction'
import { useAuctionCommitments } from 'app/features/miso/context/hooks/useAuctionCommitments'
import { AuctionCommitment } from 'app/features/miso/context/types'
import { classNames, getExplorerLink, shortenAddress, shortenString } from 'app/functions'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC, useMemo, useState } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

export const useCommitmentTableConfig = (commitments?: AuctionCommitment[]) => {
  const { chainId } = useActiveWeb3React()

  const AssetColumns = useMemo(
    () =>
      chainId
        ? [
            {
              Header: 'Address',
              accessor: 'address',
              className: 'text-left',
              Cell: (props: { value: string }) => {
                return (
                  <ExternalLink href={getExplorerLink(chainId, props.value, 'address')}>
                    {shortenAddress(props.value)}
                  </ExternalLink>
                )
              },
            },
            {
              Header: 'Committed',
              accessor: 'amount',
              className: 'text-right justify-end',
              Cell: (props: { value: CurrencyAmount<Currency> }) => {
                return (
                  <span className="flex gap-1">
                    {props.value.toSignificant(6)}
                    <span className="text-secondary">{props.value.currency.symbol}</span>
                  </span>
                )
              },
            },
            {
              Header: 'Block',
              accessor: 'blockNumber',
              className: 'text-right justify-end hidden md:block',
            },
            {
              Header: 'Transaction',
              accessor: 'txHash',
              className: 'text-right justify-end hidden lg:block',
              Cell: (props: { value: string }) => {
                return (
                  <ExternalLink href={getExplorerLink(chainId, props.value, 'transaction')}>
                    {shortenString(props.value, 12)}
                  </ExternalLink>
                )
              },
            },
          ]
        : [],
    [chainId]
  )

  const defaultColumn = React.useMemo(() => ({ minWidth: 0 }), [])

  return useMemo(
    () => ({
      config: {
        columns: AssetColumns,
        data: commitments || [],
        defaultColumn,
        initialState: {
          pageSize: 10,
          sortBy: [{ id: 'blockNumber', desc: true }],
        },
        autoResetFilters: false,
      },
    }),
    [AssetColumns, commitments, defaultColumn]
  )
}

interface AuctionBidsTabProps {
  auction: Auction
  active: boolean
}

const AuctionBidsTab: FC<AuctionBidsTabProps> = ({ auction, active }) => {
  const { account } = useActiveWeb3React()
  const { commitments } = useAuctionCommitments(auction)
  const blockNumber = useBlockNumber()
  const [ownBidsOnly, setOwnBidsOnly] = useState(false)
  const data = useMemo(() => {
    if (ownBidsOnly) {
      return commitments.filter((el) => el.address.toLowerCase() === account?.toLowerCase())
    }
    return commitments
  }, [account, commitments, ownBidsOnly])
  const { config } = useCommitmentTableConfig(data)
  const { i18n } = useLingui()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // @ts-ignore TYPE NEEDS FIXING
    page,
    // @ts-ignore TYPE NEEDS FIXING
    gotoPage,
    // @ts-ignore TYPE NEEDS FIXING
    canPreviousPage,
    // @ts-ignore TYPE NEEDS FIXING
    canNextPage,
    prepareRow,
    // @ts-ignore TYPE NEEDS FIXING
    state: { pageIndex, pageSize },
    // @ts-ignore TYPE NEEDS FIXING
  } = useTable(config, useSortBy, usePagination, useFlexLayout)

  return (
    <div className={classNames(active ? 'block' : 'hidden', 'flex flex-col gap-8')}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <Typography variant="lg" className="text-high-emphesis">
            {i18n._(t`Participants`)}
          </Typography>
          <Typography variant="lg" weight={700} className="text-white">
            {[...new Set(commitments.map((el) => el.address))].length}
          </Typography>
        </div>
        <Switch.Group>
          <div className="flex items-center">
            <Switch.Label className="mr-2 cursor-pointer">
              <Typography className={ownBidsOnly ? 'text-primary' : 'text-secondary'}>
                {i18n._(t`Show my bids only`)}
              </Typography>
            </Switch.Label>
            <Switch
              checked={ownBidsOnly}
              onChange={setOwnBidsOnly}
              className="relative inline-flex items-center h-3 transition-colors bg-gray-600 rounded-full w-9"
            >
              <span
                className={`${
                  ownBidsOnly ? 'translate-x-5' : ''
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>
      <div className="flex flex-col gap-2">
        <div {...getTableProps()} className="w-full">
          <div className="mb-3">
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            {headerGroups.map((headerGroup, i) => (
              <div {...headerGroup.getHeaderGroupProps()} key={i}>
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                {headerGroup.headers.map((column, i) => (
                  <Typography
                    weight={700}
                    // @ts-ignore TYPE NEEDS FIXING
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={i}
                    // @ts-ignore TYPE NEEDS FIXING
                    className={classNames(column.className)}
                  >
                    {column.render('Header')}
                  </Typography>
                ))}
              </div>
            ))}
          </div>
          <div {...getTableBodyProps()}>
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <div {...row.getRowProps()} key={i} className="space-y-4">
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  {row.cells.map((cell, i) => {
                    return (
                      <Typography
                        weight={400}
                        key={i}
                        {...cell.getCellProps()}
                        className={classNames(
                          'flex items-center text-high-emphesis',
                          // @ts-ignore TYPE NEEDS FIXING
                          headerGroups[0].headers[i].className
                        )}
                      >
                        {cell.render('Cell')}
                      </Typography>
                    )
                  })}
                </div>
              )
            })}
            {blockNumber && (
              <Typography
                variant="xs"
                className="text-center text-low-emphesis h-[60px] flex items-center justify-center italic"
              >
                {i18n._(t`Commitments in blocks before block ${blockNumber - 100000} wont be displayed here`)}
              </Typography>
            )}
          </div>
        </div>
        <Pagination
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          onChange={gotoPage}
          totalPages={Math.ceil(data.length / pageSize)}
          currentPage={pageIndex}
          pageNeighbours={1}
        />
      </div>
    </div>
  )
}

export default AuctionBidsTab
