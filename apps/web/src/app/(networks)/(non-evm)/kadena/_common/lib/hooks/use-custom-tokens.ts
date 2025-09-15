import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback, useMemo } from 'react'
import { KvmChainId, KvmToken, isKvmTokenAddress } from 'sushi/kvm'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'

const localStorageKey = 'sushi.customTokens.kvm'

export const useCustomTokens = () => {
  const [value, setValue] = useLocalStorage<Record<string, KvmToken>>(
    localStorageKey,
    {},
  )

  const hydrate = useCallback((data: Record<string, KvmToken>) => {
    return Object.entries(data).reduce<Record<string, KvmToken>>(
      (acc, [k, { address, name, symbol, decimals }]) => {
        acc[k] = new KvmToken({
          chainId: KvmChainId.KADENA,
          address,
          name,
          decimals,
          symbol,
          metadata: {
            imageUrl: data[k]?.metadata?.imageUrl || undefined,
            validated: data[k]?.metadata.validated || false,
            kadenaChainId: data[k]?.metadata?.kadenaChainId || KADENA_CHAIN_ID,
            kadenaNetworkId:
              data[k]?.metadata?.kadenaNetworkId || KADENA_NETWORK_ID,
          },
        })
        return acc
      },
      {},
    )
  }, [])

  const addCustomToken = useCallback(
    (currencies: KvmToken[]) => {
      const data: KvmToken[] = currencies.map((currency) => {
        return new KvmToken({
          chainId: KvmChainId.KADENA,
          address: currency?.address,
          symbol: currency?.symbol,
          decimals: currency?.decimals,

          name: currency?.name,

          metadata: {
            imageUrl: currency.metadata?.imageUrl || undefined,
            validated: currency?.metadata.validated || false,
            kadenaChainId: currency?.metadata?.kadenaChainId || KADENA_CHAIN_ID,
            kadenaNetworkId:
              currency?.metadata?.kadenaNetworkId || KADENA_NETWORK_ID,
          },
        })
      })

      setValue((prev) => {
        return data.reduce(
          (acc, cur) => {
            acc[`${cur.address}`] = cur
            return acc
          },
          { ...prev },
        )
      })
    },
    [setValue],
  )

  const removeCustomToken = useCallback(
    (currency: KvmToken) => {
      setValue((prev) => {
        return Object.entries(prev).reduce<Record<string, KvmToken>>(
          (acc, cur) => {
            if (cur[0] === `${currency.address}`) {
              return acc // filter
            }
            acc[cur[0]] = cur[1] // add
            return acc
          },
          {},
        )
      })
    },
    [setValue],
  )

  const hasToken = useCallback(
    (currency: string | KvmToken): boolean => {
      const address = typeof currency === 'string' ? currency : currency.address
      if (address === 'coin') return false
      // console.log("CHECKING", address, value);
      // if (!isKvmTokenAddress(address)) {
      // 	throw new Error("Invalid KVM Token address");
      // }

      return !!value[address]
    },
    [value],
  )

  const addOrRemoveToken = useCallback(
    (type: 'add' | 'remove', currency: KvmToken[]) => {
      if (type === 'add') addCustomToken(currency)
      if (type === 'remove') removeCustomToken(currency[0])
    },
    [addCustomToken, removeCustomToken],
  )

  return useMemo(() => {
    return {
      customTokens: hydrate(value),
      addOrRemoveToken,
      hasToken,
    }
  }, [hydrate, addOrRemoveToken, hasToken, value])
}
