import { formatUnits } from '@ethersproject/units'
import { formatNumber, formatUSD, shortenAddress } from '@sushiswap/format'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTable } from 'react-table'
import useSWR, { SWRConfig } from 'swr'
import { EXPECTED_OPS_OWNER_COUNT, EXPECTED_OPS_THRESHOLD, SAFES, USERS } from 'config'
import { SafeBalance, SafeInfo } from 'types'
import { getBalance, getSafe } from 'api'

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

  useEffect(() => {
    setFormattedBalance(
      balance?.items.filter((token) => parseFloat(token.balance) > 0 && parseFloat(token.fiatBalance) > 0) ?? [],
    )
  }, [balance])

  const columns = useMemo(
    () => [
      {
        Header: 'Token',
        accessor: 'tokenInfo.name',
      },
      {
        Header: 'Address',
        accessor: 'tokenInfo.address',
        Cell: (props) => {
          return shortenAddress(props.value)
        },
      },
      {
        Header: 'Amount',
        accessor: 'balance',
        Cell: (props) => {
          return formatNumber(formatUnits(props.value, props.cell.row.original.tokenInfo.decimals))
        },
      },
      {
        Header: 'Total (USD)',
        accessor: 'fiatBalance',
        Cell: (props) => {
          return formatUSD(props.value)
        },
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: formattedBalance,
  })

  return (
    <>
      <h1>Safe Info</h1>
      <h2>{chainId}</h2>
      <div>Type: {safe.type}</div>
      <div>Address: {safe.address?.value}</div>
      <div>
        Threshold:
        {isValidThreshold(safe.threshold, safe.owners.length) ? (
          `${safe.threshold} / ${safe.owners.length}`
        ) : (
          <div style={{ color: 'red' }}>
            {safe.threshold} / {safe.owners.length}
          </div>
        )}
      </div>
      <div>
        Owners:{' '}
        {safe.owners
          .map((owner) => USERS.get(owner.value) ?? <p style={{ color: 'red' }}>{owner.value}</p>)
          .sort()
          .join(' ')}
      </div>
      <div>Total balance: {formatUSD(balance?.fiatTotal)}</div>

      <h2>Tokens</h2>
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`thr-${i}`}>
              {headerGroup.headers.map((column, i) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                  key={`th-${i}`}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={`row-${i}`}>
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                        background: '#1E1A38',
                      }}
                      key={`cell-${i}`}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
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
