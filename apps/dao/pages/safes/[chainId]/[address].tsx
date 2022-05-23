import { formatUnits } from '@ethersproject/units'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import chain, { ChainId } from '@sushiswap/chain'
import { formatNumber, formatUSD, shortenAddress } from '@sushiswap/format'
import { classNames, Table, Typography } from '@sushiswap/ui'
import ExternalLink from '@sushiswap/ui/link/External'
import { getBalance, getSafe } from 'api'
import { EXPECTED_OPS_OWNER_COUNT, EXPECTED_OPS_THRESHOLD, SAFES, USERS } from 'config'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { useFilters, useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'
import useSWR, { SWRConfig } from 'swr'
import { SafeInfo } from 'types'

const isValidThreshold = (threshold: number, ownerCount: number): boolean => {
  return threshold === EXPECTED_OPS_THRESHOLD && ownerCount === EXPECTED_OPS_OWNER_COUNT
}

const SafeTable = () => {
  const router = useRouter()
  const chainId = router.query.chainId as string
  const address = router.query.address as string

  const { data: safe } = useSWR(`/api/safes/${chainId}/${address}`)

  const { data: balance } = useSWR(`/api/balances/${chainId}/${address}`)

  const [formattedBalance, setFormattedBalance] = useState([])
  const { explorers } = chain?.[chainId]

  useEffect(() => {
    setFormattedBalance(
      balance?.items.filter((token) => parseFloat(token.balance) > 0 && parseFloat(token.fiatBalance) > 0) ?? []
    )
  }, [balance])

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'tokenInfo.name',
        maxWidth: 40,
      },

      {
        Header: 'Symbol',
        accessor: 'tokenInfo.symbol',
        maxWidth: 40,
      },
      {
        Header: 'Address',
        accessor: 'tokenInfo.address',
        maxWidth: 40,
        Cell: (props: any) => {
          return shortenAddress(props.value)
        },
      },
      {
        Header: 'Amount',
        accessor: 'balance',
        maxWidth: 40,
        Cell: (props: any) => {
          return formatNumber(formatUnits(props.value, props.cell.row.original.tokenInfo.decimals))
        },
      },
      {
        Header: 'Total (USD)',
        accessor: 'fiatBalance',
        maxWidth: 40,
        Cell: (props: any) => {
          return formatUSD(props.value)
        },
      },
    ],
    []
  )

  const config = useMemo(
    () => ({
      columns,
      data: formattedBalance,
      initialState: {
        sortBy: [{ id: 'fiatBalance', desc: true }],
      },
      autoResetFilters: false,
    }),
    [columns, formattedBalance]
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    config,
    useFlexLayout,
    useFilters,
    useSortBy,
    useFlexLayout,
    usePagination
  )

  return (
    <>
      <Typography variant="h1" className="text-high-emphesis">
        {ChainId[Number(chainId)]} - {safe.type}
      </Typography>
      <div className={'flex gap-20'}>
        <div>
          <Typography variant="lg" weight={700} className="mt-1 text-high-emphesis">
            Address
          </Typography>
          <Typography>
            <ExternalLink href={`${explorers?.[0]?.url}/address/${address}`} className={classNames('hover:underline ')}>
              {shortenAddress(safe.address?.value)}
            </ExternalLink>
          </Typography>
        </div>
        <div>
          <Typography variant="lg" weight={700} className="mt-1 text-high-emphesis">
            Threshold
          </Typography>
          <Typography>
            <p
              className={classNames(
                isValidThreshold(safe.threshold, safe.owners.length) ? 'text-green-400' : 'text-red-400'
              )}
            >
              {`${safe.threshold} / ${safe.owners.length}`}
            </p>
          </Typography>
        </div>
        <div>
          <Typography variant="lg" weight={700} className="mt-1 text-high-emphesis">
            Owners
          </Typography>

          <div className={'flex gap-2'}>
            {safe.owners
              .map((owner) => [owner.value, USERS.get(owner.value)])
              .sort()
              .map(([address, name], i) => (
                <>
                  <ExternalLink
                    href={`${explorers?.[0]?.url}/address/${address}`}
                    key={i}
                    className={classNames(
                      !USERS.has(address) &&
                        'text-red-400 hover:text-red hover:underline focus:text-red active:text-red'
                    )}
                  >
                    <Typography>{name ?? '???'}</Typography>
                  </ExternalLink>
                </>
              ))}
          </div>
        </div>
        <div>
          <Typography variant="lg" weight={700} className="mt-1 text-high-emphesis">
            Balance
          </Typography>
          <Typography>{formatUSD(balance?.fiatTotal)}</Typography>
        </div>
      </div>

      <Typography variant="h2" className="text-high-emphesis">
        Tokens
      </Typography>
      <Table.container>
        <Table.table {...getTableProps()}>
          <Table.thead>
            {headerGroups.map((headerGroup, i) => (
              <Table.thr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <Table.th
                    // @ts-ignore TYPE NEEDS FIXING
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={i}
                  >
                    {column.render('Header')}
                    <span className="inline-block ml-1 align-middle">
                      {/*@ts-ignore TYPE NEEDS FIXING*/}
                      {column.isSorted ? (
                        // @ts-ignore TYPE NEEDS FIXING
                        column.isSortedDesc ? (
                          <ArrowDownIcon width={12} />
                        ) : (
                          <ArrowUpIcon width={12} />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </Table.th>
                ))}
              </Table.thr>
            ))}
          </Table.thead>
          <Table.tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <Table.tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, i) => {
                    return (
                      <Table.td {...cell.getCellProps()} key={i}>
                        {cell.render('Cell')}
                      </Table.td>
                    )
                  })}
                </Table.tr>
              )
            })}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </>
  )
}

interface SafeProps {
  fallback: Record<string, SafeInfo>
  chainId: string
  address: string
}

const Safe: FC<SafeProps> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <SafeTable />
    </SWRConfig>
  )
}

export async function getStaticPaths() {
  const paths = Object.values(SAFES).map(({ chainId, address }) => ({
    params: { chainId: String(chainId), address },
  }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps = async (context) => {
  const { chainId, address } = context.params
  const safe = await getSafe(address)
  const balance = await getBalance(address)
  return {
    props: {
      fallback: {
        [`/api/safes/${chainId}/${address}`]: safe,
        [`/api/balances/${chainId}/${address}`]: balance,
      },
    },
    revalidate: 90, // 90s
  }
}

export default Safe
