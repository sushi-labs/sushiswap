import { FC, useMemo } from 'react'
import { useFlexLayout, useTable } from 'react-table'
import useSWR, { SWRConfig } from 'swr'
import { EXPECTED_OWNER_COUNT, EXPECTED_THRESHOLD, USERS } from 'config'
import { formatUSD, shortenAddress } from '@sushiswap/format'
import Link from 'next/link'
import { JSBI } from '@sushiswap/math'
import { ChainId } from '@sushiswap/chain'
import { SafeInfo } from 'types'
import { Table, Typography } from '@sushiswap/ui'
import { Layout } from 'components'
import { getSafes } from 'api'

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
        Cell: (props) => {
          return ChainId[props.cell.value]
        },
      },
      {
        Header: 'Type',
        accessor: 'type',
        width: 100,
      },
      {
        Header: 'Address',
        accessor: 'address',
        Cell: (props) => {
          return shortenAddress(props.value?.value)
        },
        width: 150,
      },
      {
        Header: 'Threshold',
        accessor: 'threshold',
        width: 100,
        Cell: (props) => {
          const threshold = props.value
          if (threshold === -1) {
            return 'NA'
          }
          const ownerCount = props.row.cells[4].value.length
          const formattedOwnerCount =
            ownerCount === EXPECTED_OWNER_COUNT ? ownerCount : <p style={{ color: 'red' }}>{ownerCount}</p>
          const formattedThreshold =
            props.value === EXPECTED_THRESHOLD ? threshold : <p style={{ color: 'red' }}>{threshold}</p>
          return formattedThreshold + ' / ' + formattedOwnerCount
        },
      },
      {
        Header: 'Owners',
        accessor: 'owners',
        width: 250,
        Cell: (props) => {
          return props.cell.value
            .map((owner) => USERS.get(owner.value) ?? <p style={{ color: 'red' }}>{owner.value}</p>)
            .sort()
            .join(' ')
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
        Cell: (props) => {
          const chainId = props.row.original.chainId
          const address = props.row.original.address.value
          const url = '/safes/' + chainId + '/' + address
          return <Link href={url}>View</Link>
        },
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useFlexLayout,
  )

  return (
    <Layout>
      <Typography variant="h1" className="mb-4">
        Safes {balance}
      </Typography>

      <Table.container>
        <Table.table {...getTableProps()}>
          <Table.thead>
            {headerGroups.map((headerGroup, i) => (
              <Table.thr {...headerGroup.getHeaderGroupProps()} key={`thr-${i}`}>
                {headerGroup.headers.map((column, i) => (
                  <Table.th {...column.getHeaderProps()} key={`th-${i}`}>
                    {column.render('Header')}
                  </Table.th>
                ))}
              </Table.thr>
            ))}
          </Table.thead>
          <Table.tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <Table.tr {...row.getRowProps()} key={`row-${i}`}>
                  {row.cells.map((cell, i) => {
                    return (
                      <Table.td {...cell.getCellProps()} key={`cell-${i}`}>
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
    </Layout>
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
  return {
    props: {
      fallback: {
        '/api/safes': safes,
      },
    },
    revalidate: 90, // 90s
  }
}

export default Safes
