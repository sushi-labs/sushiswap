import { usePathname, useSearchParams } from 'next/navigation'
import type { ChainId } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import type { EvmCurrency } from 'sushi/evm'
import { useSwitchChain } from 'wagmi'
import { NativeAddress } from '../constants'
import { getNetworkKey } from '../network'
import { useCreateQuery } from './useCreateQuery'

export const useSwapTokenSelect = () => {
  const { createQuery } = useCreateQuery()
  const { switchChainAsync } = useSwitchChain()
  const pathname = usePathname()
  const isAdvancedSwap = pathname.includes('advanced')

  const searchParams = useSearchParams()
  const token0 = searchParams.get('token0')
  const chainId0 = searchParams.get('chainId0')
  const token1 = searchParams.get('token1')
  const chainId1 = searchParams.get('chainId1')

  const handleTokenInput = async ({ token }: { token: EvmCurrency }) => {
    await switchChainAsync({ chainId: token?.chainId as EvmChainId })
    const tokenAddress =
      token.isNative || token.address.toLowerCase() === NativeAddress
        ? 'NATIVE'
        : token.wrap().address
    if (tokenAddress === token1 && chainId1 === String(token.chainId)) {
      createQuery(
        [
          {
            name: 'swapAmount',
            value: null,
          },
          {
            name: 'token0',
            value: token1,
          },
          {
            name: 'chainId0',
            value: chainId1,
          },
          {
            name: 'token1',
            value: token0,
          },
          {
            name: 'chainId1',
            value: chainId0,
          },
        ],
        `/${getNetworkKey(token?.chainId as ChainId)}/swap${isAdvancedSwap ? '/advanced' : ''}`,
      )
    } else {
      createQuery(
        [
          {
            name: 'swapAmount',
            value: null,
          },
          {
            name: 'token0',
            value: tokenAddress,
          },
          {
            name: 'chainId0',
            value: String(token.chainId),
          },
        ],
        `/${getNetworkKey(token?.chainId as ChainId)}/swap${isAdvancedSwap ? '/advanced' : ''}`,
      )
    }
  }
  const handleTokenOutput = async ({ token }: { token: EvmCurrency }) => {
    const tokenAddress =
      token.isNative || token.address.toLowerCase() === NativeAddress
        ? 'NATIVE'
        : token.wrap().address
    if (tokenAddress === token0 && chainId0 === String(token.chainId)) {
      await switchChainAsync({ chainId: Number(chainId1) as EvmChainId })
      createQuery(
        [
          {
            name: 'swapAmount',
            value: null,
          },
          {
            name: 'token0',
            value: token1,
          },
          {
            name: 'chainId0',
            value: chainId1,
          },
          {
            name: 'token1',
            value: token0,
          },
          {
            name: 'chainId1',
            value: chainId0,
          },
        ],
        `/${getNetworkKey(Number(chainId1) as ChainId)}/swap${isAdvancedSwap ? '/advanced' : ''}`,
      )
    } else {
      createQuery([
        {
          name: 'token1',
          value: tokenAddress,
        },
        {
          name: 'chainId1',
          value: String(token.chainId),
        },
      ])
    }
  }

  return {
    handleTokenInput,
    handleTokenOutput,
  }
}
