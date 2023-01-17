import React, { FC, useCallback, useMemo } from 'react'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { useToken } from 'wagmi'
import { queryParamsSchema, useSwapActions, useSwapState } from './trade/TradeProvider'
import { useRouter } from 'next/router'
import { isAddress } from 'ethers/lib/utils'
import { Token } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui13/components/currency'
import { List } from '@sushiswap/ui13/components/list/List'
import { Button } from '@sushiswap/ui13/components/button'
import { Chain } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { useAddCustomToken } from '@sushiswap/react-query'

export const TokenNotFoundDialog = () => {
  const { query } = useRouter()
  const { fromCurrencyId, toCurrencyId } = queryParamsSchema.parse(query)
  const { token0NotInList, token1NotInList, network0, network1 } = useSwapState()
  const { setToken0, setToken1 } = useSwapActions()
  const { mutate: addCustomToken } = useAddCustomToken()

  const { data: _token0 } = useToken({
    address: fromCurrencyId as `0x${string}`,
    chainId: network0,
    enabled: isAddress(fromCurrencyId) && token0NotInList,
  })

  const { data: _token1 } = useToken({
    address: toCurrencyId as `0x${string}`,
    chainId: network1,
    enabled: isAddress(toCurrencyId) && token1NotInList,
  })

  const [token0, token1] = useMemo(() => {
    return [
      _token0
        ? new Token({
            address: _token0.address,
            symbol: _token0.symbol,
            decimals: _token0.decimals,
            chainId: network0,
            name: _token0.name,
          })
        : undefined,
      _token1
        ? new Token({
            address: _token1.address,
            symbol: _token1.symbol,
            decimals: _token1.decimals,
            chainId: network0,
            name: _token1.name,
          })
        : undefined,
    ]
  }, [_token0, _token1, network0])

  const onImport = useCallback(
    ([token0, token1]: (Token | undefined)[]) => {
      if (token0) {
        addCustomToken(token0)
        setToken0(token0)
      }

      if (token1) {
        addCustomToken(token1)
        setToken1(token1)
      }
    },
    [addCustomToken, setToken0, setToken1]
  )

  return (
    <Dialog open={token0NotInList || token1NotInList} onClose={() => {}}>
      {token1 && (
        <Dialog.Content className="flex flex-col gap-4 px-4 sm:!rounded-[24px]">
          <>
            <div className="flex justify-between items-center py-2">
              <span className="text-lg font-semibold dark:text-slate-50 text-gray-900">
                Unknown Token{token0 && token1 ? 's' : ''}
              </span>
              <Currency.Icon currency={token1} width={26} height={26} />
            </div>
            <p className="text-gray-700 dark:text-slate-400">
              Anyone can create a token, including creating fake versions of existing tokens that claim to represent
              projects. If you purchase this token, you may not be able to sell it back.
            </p>
            {token0 && (
              <List>
                <List.Label>Token {token0 && token1 ? '1' : ''}</List.Label>
                <List.Control>
                  <List.KeyValue title="Name">{token1?.name}</List.KeyValue>
                  <List.KeyValue title="Symbol">{token1?.symbol}</List.KeyValue>
                  <List.KeyValue title="Address">
                    <a href={Chain.from(network1).getTokenUrl(token1.address)} className="text-blue">
                      {shortenAddress(token1.address)}
                    </a>
                  </List.KeyValue>
                </List.Control>
              </List>
            )}
            {token1 && (
              <List>
                <List.Label>Token {token0 && token1 ? '2' : ''}</List.Label>
                <List.Control>
                  <List.KeyValue title="Name">{token1?.name}</List.KeyValue>
                  <List.KeyValue title="Symbol">{token1?.symbol}</List.KeyValue>
                  <List.KeyValue title="Address">
                    <a href={Chain.from(network1).getTokenUrl(token1.address)} className="text-blue">
                      {shortenAddress(token1.address)}
                    </a>
                  </List.KeyValue>
                </List.Control>
              </List>
            )}
            <Button size="xl" onClick={() => onImport([token0, token1])}>
              I understand
            </Button>
          </>
        </Dialog.Content>
      )}
    </Dialog>
  )
}
