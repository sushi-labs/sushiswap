import { ArrowDownIcon, ArrowRightIcon,ArrowUpIcon } from '@heroicons/react/solid'
import chain, { ChainId } from '@sushiswap/chain'
import { formatUSD, shortenAddress } from '@sushiswap/format'
import { classNames, Table, Typography } from '@sushiswap/ui'
import ExternalLink from '@sushiswap/ui/link/External'
import { getSafes } from 'api'
import {
  EXPECTED_OPS_OWNER_COUNT,
  EXPECTED_OPS_THRESHOLD,
  EXPECTED_TREASURY_OWNER_COUNT,
  EXPECTED_TREASURY_THRESHOLD,
  USERS,
} from 'config'
import Link from 'next/link'
import { FC, useMemo } from 'react'
import { useFilters, useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'
import useSWR, { SWRConfig } from 'swr'
import { SafeInfo } from 'types'

const SafeTable = () => {
  const { data } = useSWR('/api/safes')

  const balance = formatUSD(
    String(data.reduce((previousValue, currentValue) => previousValue + Number(currentValue.balance), 0)),
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Network',
        accessor: 'chainId',
        width: 100,
        Cell: (props) => ChainId[props.cell.value]
      },
      {
        Header: 'Type',
        accessor: 'type',
        width: 100,
      },
      {
        Header: 'Address',
        accessor: 'address',
        width: 120,
        Cell: (props) => {
          const { explorers } = chain?.[props.row.original.chainId]
          return (
            <ExternalLink href={`${explorers?.[0]?.url}/address/${props.value?.value}`}>
              {shortenAddress(props.value?.value)}
            </ExternalLink>
          )
        },
      },
      {
        Header: 'Threshold',
        accessor: 'threshold',
        width: 100,
        Cell: (props) => {
          const threshold = Number(props.value)
          const ownerCount = Number(props.row.cells[4].value.length)
          return (
            <div className="flex space-x-1">
              {
                <p
                  className={classNames(
                    (props.row.cells[1].value !== 'Treasury' && threshold === EXPECTED_OPS_THRESHOLD) ||
                      (props.row.cells[1].value === 'Treasury' && threshold === EXPECTED_TREASURY_THRESHOLD)
                      ? 'text-green'
                      : 'text-red',
                  )}
                >
                  {threshold}
                </p>
              }{' '}
              <span className="text-gray-400">of</span>
              {
                <p
                  className={classNames(
                    (props.row.cells[1].value !== 'Treasury' && ownerCount === EXPECTED_OPS_OWNER_COUNT) ||
                      (props.row.cells[1].value === 'Treasury' && ownerCount === EXPECTED_TREASURY_OWNER_COUNT)
                      ? 'text-green'
                      : 'text-red',
                  )}
                >
                  {ownerCount}
                </p>
              }
            </div>
          )
        },
        align: 'right',
      },
      {
        Header: 'Owners',
        accessor: 'owners',
        minWidth: 300,
        Cell: (props) => {
          const { explorers } = chain?.[props.row.original.chainId]
          return (
            <div className="flex space-x-2">
              {props.cell.value
                .map((owner) => [owner.value, USERS.get(owner.value)])
                .sort()
                .map(([address, name], i) => (
                  <>
                    <ExternalLink
                      href={`${explorers?.[0]?.url}/address/${address}`}
                      key={i}
                      className={classNames(
                        !USERS.has(address) && 'text-red hover:text-red hover:underline focus:text-red active:text-red',
                      )}
                    >
                      {name ?? '???'}
                    </ExternalLink>
                    {i !== props.cell.value.length - 1 && <>, </>}
                  </>
                ))}
            </div>
          )
        },
      },
      {
        Header: 'Balance',
        accessor: 'balance',
        Cell: (props) => {
          if (props.cell.value === 'NA') {
            return 'NA'
          }
          return formatUSD(props.cell.value)
        },
      },
      {
        Header: 'Actions',
        width: 72,
        Cell: (props) => {
          const chainId = props.row.original.chainId
          const address = props.row.original.address.value
          const url = '/safes/' + chainId + '/' + address
          return (
            <Link href={url} passHref>
              <ArrowRightIcon width={16} height={16} />
            </Link>
          )
        },
      },
    ],
    [],
  )

  const config = useMemo(
    () => ({
      columns,
      data,
      initialState: {
        sortBy: [{ id: 'balance', desc: true }],
      },
      autoResetFilters: false,
    }),
    [columns, data],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    config,
    useFlexLayout,
    useFilters,
    useSortBy,
    useFlexLayout,
    usePagination,
  )

  const { data: sushiHOUSE } = useSWR(
    'https://openapi.debank.com/v1/user/total_balance?id=0x7b18913d945242a9c313573e6c99064cd940c6af',
    (url) => fetch(url).then((response) => response.json()),
  )

  return (
    <>
      <div className="flex space-x-4">
        <Typography variant="h3">SushiSAFES: {balance}, </Typography>
        <Typography variant="h3">
          SushiHOUSE: {formatUSD(sushiHOUSE.total_usd_value)}{' '}
          <ExternalLink
            href="https://etherscan.io/address/0x7b18913d945242a9c313573e6c99064cd940c6af"
            className="text-xs"
            color="blue"
          >
            {sushiHOUSE.address}
          </ExternalLink>
        </Typography>
      </div>

      <Table.container>
        <Table.table {...getTableProps()}>
          <Table.thead>
            {headerGroups.map((headerGroup, i) => (
              <Table.thr {...headerGroup.getHeaderGroupProps()} key={`thr-${i}`}>
                {headerGroup.headers.map((column, i) => (
                  <Table.th
                    // @ts-ignore TYPE NEEDS FIXING
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`th-${i}`}
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
                <Table.tr key={`row-${i}`} {...row.getRowProps()}>
                  {row.cells.map((cell, i) => {
                    return (
                      <Table.td key={`cell-${i}`} {...cell.getCellProps()}>
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

interface SafesProps {
  fallback: Record<'/api/safes', SafeInfo[]>
}

const Safes: FC<SafesProps> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <SafeTable />
    </SWRConfig>
  )
}

export const getStaticProps = async () => {
  const safes = await getSafes()
  const sushiHOUSE = await fetch(
    'https://openapi.debank.com/v1/user/total_balance?id=0x7b18913d945242a9c313573e6c99064cd940c6af',
    {
      method: 'GET',
    },
  ).then((response) => response.json())
  return {
    props: {
      fallback: {
        '/api/safes': safes,
        'https://openapi.debank.com/v1/user/total_balance?id=0x7b18913d945242a9c313573e6c99064cd940c6af': sushiHOUSE,
      },
    },
    revalidate: 90, // 90s
  }
}

export default Safes
