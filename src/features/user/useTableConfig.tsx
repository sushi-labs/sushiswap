import { formatNumber, formatPercent } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import { useMemo } from 'react'

export const useTableConfig = (chainId: number, users: any) => {
  const allTokens = useAllTokens()
  const data = useMemo(() => {
    return (
      users
        // @ts-ignore
        ?.map((user: any) => ({
          id: user.id,
          address: user.address,
          share: user.share,
          amount: user.amount,
          amountUSD: user.amountUSD,
        }))
    )
  }, [users])

  const columns = useMemo(
    () => [
      {
        Header: 'Liquidity Provider',
        accessor: 'address',
        maxWidth: 150,
        Cell: (props: any) => <div className="flex items-center gap-2 overflow-hidden">{props.value}</div>,
      },
      {
        Header: 'Pool Share',
        accessor: 'share',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value, '0'),
        align: 'right',
      },
      {
        Header: 'Liquidity Token Staked',
        accessor: 'amountUSD',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false, 2),
        align: 'right',
      },
    ],
    []
  )

  return useMemo(
    () => ({
      config: {
        columns,
        data: data ?? [],
        initialState: {
          sortBy: [{ id: 'amountUSD', desc: true }],
        },
        autoResetFilters: false,
      },
      // loading: isValidating,
      // error,
    }),
    [columns, data]
  )
}
