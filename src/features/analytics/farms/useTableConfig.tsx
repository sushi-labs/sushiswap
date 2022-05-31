import { getAddress } from '@ethersproject/address'
import { Currency, Token } from '@sushiswap/core-sdk'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import { formatNumber, formatPercent } from 'app/functions'
import { useAllTokens } from 'app/hooks/Tokens'
import { useMemo } from 'react'

import { filterForSearchQuery } from './farmTableFilters'

export const useTableConfig = (chainId: number, farms: any) => {
  const allTokens = useAllTokens()
  const data = useMemo(() => {
    return (
      farms
        // @ts-ignore
        ?.map((farm: any) => ({
          pair: {
            id: farm.pair.id,
            token0: farm.pair.token0,
            token1: farm.pair.token1,
            name: farm.pair.symbol ?? `${farm.pair.token0.symbol}-${farm.pair.token1.symbol}`,
            type: farm.pair.symbol ? 'Kashi Farm' : 'Sushi Farm',
          },
          rewards: farm.rewards,
          liquidity: farm.tvl,
          apr: {
            daily: farm.roiPerDay * 100,
            monthly: farm.roiPerMonth * 100,
            annual: farm.roiPerYear * 100,
          },
        }))
    )
  }, [farms])

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'pair',
        maxWidth: 150,
        // @ts-ignore
        Cell: (props) => {
          const currency0Address = getAddress(props.value.token0.id)
          const currency0 = useMemo(
            () =>
              currency0Address in allTokens
                ? allTokens[currency0Address]
                : new Token(
                    chainId,
                    getAddress(props.value.token0.id),
                    Number(props.value.token0.decimals),
                    props.value.token0.symbol,
                    props.value.token0.name
                  ),
            [props, currency0Address]
          )
          const currency1Address = getAddress(props.value.token1.id)
          const currency1 = useMemo(
            () =>
              currency1Address in allTokens
                ? allTokens[currency1Address]
                : new Token(
                    chainId,
                    currency1Address,
                    Number(props.value.token1.decimals),
                    props.value.token1.symbol,
                    props.value.token1.name
                  ),
            [props, currency1Address]
          )
          const currencies = useMemo(() => [currency0, currency1], [currency0, currency1])
          return (
            <div className="flex items-center gap-2 overflow-hidden">
              <CurrencyLogoArray currencies={currencies} size={40} dense />
              <div
                id={`farm-${props.value.token0.symbol}/${props.value.token1.symbol}`}
                className="overflow-hidden font-bold text-high-emphesis overflow-ellipsis whitespace-nowrap"
              >
                <div className="flex flex-col ml-3 whitespace-nowrap">
                  <div className="font-bold text-high-emphesis">{props.value.name}</div>
                  <div className="text-secondary">{props.value.type}</div>
                </div>
              </div>
            </div>
          )
        },
        filter: filterForSearchQuery,
      },
      {
        Header: 'TVL',
        accessor: 'liquidity',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatNumber(props.value, true, false, 2),
        align: 'right',
      },
      {
        Header: 'Rewards',
        accessor: 'rewards',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => {
          return (
            <CurrencyLogoArray
              currencies={props.value.map((reward: { currency: Currency }) => reward.currency)}
              size={20}
              dense
            />
          )
        },
        align: 'right',
      },
      {
        Header: 'Reward APR',
        accessor: 'apr.annual',
        minWidth: 150,
        // @ts-ignore
        Cell: (props) => formatPercent(props.value, 'NEW'),
        align: 'right',
      },
    ],
    [chainId]
  )

  return useMemo(
    () => ({
      config: {
        columns,
        data: data ?? [],
        initialState: {
          sortBy: [{ id: 'apr.annual', desc: true }],
        },
        autoResetFilters: false,
      },
      // loading: isValidating,
      // error,
    }),
    [columns, data]
  )
}
