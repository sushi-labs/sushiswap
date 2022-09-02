import { AddressZero } from '@ethersproject/constants'
import { Chain } from '@sushiswap/chain'
import { Amount, SUSHI, SUSHI_ADDRESS, Token } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
import { createToast, Dots } from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import { erc20ABI, useAccount, useContractReads, useSendTransaction } from 'wagmi'

import {
  getMasterChefContractConfig,
  getMasterChefContractV2Config,
  useMasterChefContract,
} from './useMasterChefContract'

export enum Chef {
  MASTERCHEF,
  MASTERCHEF_V2,
  MINICHEF,
}

interface UseMasterChefReturn extends Pick<ReturnType<typeof useSendTransaction>, 'isLoading' | 'isError'> {
  deposit(amount: Amount<Token> | undefined): void
  withdraw(amount: Amount<Token> | undefined): void
  balance: Amount<Token> | undefined
  harvest(): void
  pendingSushi: Amount<Token> | undefined
}

interface UseMasterChefParams {
  chainId: number
  chef: Chef
  pid: number
  token: Token
  enabled?: boolean
}

type UseMasterChef = (params: UseMasterChefParams) => UseMasterChefReturn

export const useMasterChef: UseMasterChef = ({ chainId, chef, pid, token, enabled = true }) => {
  const { address } = useAccount()
  const contract = useMasterChefContract(chainId, chef)
  const { sendTransactionAsync, isLoading, isError } = useSendTransaction({ chainId })
  const config = useMemo(() => getMasterChefContractConfig(chainId, chef), [chainId, chef])
  const v2Config = useMemo(() => getMasterChefContractV2Config(chainId), [chainId])

  const contracts = useMemo(() => {
    const inputs: any[] = []

    if (Boolean(chainId && SUSHI_ADDRESS[chainId]) && enabled) {
      inputs.push({
        chainId: chainId,
        addressOrName: chainId ? SUSHI_ADDRESS[chainId] : AddressZero,
        contractInterface: erc20ABI,
        functionName: 'balanceOf',
        args: [config.addressOrName],
      })
    }

    if (!!address && enabled && config.addressOrName) {
      inputs.push({
        chainId: chainId,
        ...config,
        functionName: 'userInfo',
        args: [pid, address],
      })
    }

    if (enabled && !!v2Config.addressOrName) {
      inputs.push({
        chainId: chainId,
        ...v2Config,
        functionName: 'pendingSushi',
        args: [pid, address],
      })
    }

    return inputs
  }, [address, chainId, config, enabled, pid, v2Config])

  const { data } = useContractReads({
    contracts,
    watch: true,
    cacheOnBlock: true,
    keepPreviousData: true,
    enabled: contracts.length > 0 && enabled,
  })

  const [sushiBalance, balance, pendingSushi] = useMemo(() => {
    const copy = data ? [...data] : []
    const _sushiBalance = Boolean(chainId && SUSHI_ADDRESS[chainId]) && enabled ? copy.shift() : undefined
    const _balance = !!address && enabled && config.addressOrName ? copy.shift()?.amount : undefined
    const _pendingSushi = enabled && !!v2Config.addressOrName ? copy.shift() : undefined

    const balance = Amount.fromRawAmount(token, _balance ? _balance.toString() : 0)
    const pendingSushi = SUSHI[chainId]
      ? Amount.fromRawAmount(SUSHI[chainId], _pendingSushi ? _pendingSushi.toString() : 0)
      : undefined
    const sushiBalance = SUSHI[chainId]
      ? Amount.fromRawAmount(SUSHI[chainId], _sushiBalance ? _sushiBalance.toString() : 0)
      : undefined
    return [sushiBalance, balance, pendingSushi]
  }, [address, chainId, config.addressOrName, data, enabled, token, v2Config.addressOrName])

  /**
   * @throws {Error}
   */
  const deposit = useCallback(
    async (amount: Amount<Token> | undefined) => {
      if (!chainId) return console.error('useMasterChef: chainId not defined')
      if (!amount) return console.error('useMasterChef: amount not defined')

      const data = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: contract.interface.encodeFunctionData(
            'deposit',
            chef === Chef.MASTERCHEF ? [pid, amount.quotient.toString()] : [pid, amount.quotient.toString(), address]
          ),
        },
      })

      createToast({
        txHash: data.hash,
        href: Chain.from(chainId).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: (
            <Dots>
              Staking {amount.toSignificant(6)} {amount.currency.symbol} tokens
            </Dots>
          ),
          completed: `Successfully staked ${amount.toSignificant(6)} ${amount.currency.symbol} tokens`,
          failed: `Something went wrong when staking ${amount.currency.symbol} tokens`,
        },
      })
    },
    [address, chainId, chef, contract.address, contract.interface, pid, sendTransactionAsync]
  )

  /**
   * @throws {Error}
   */
  const withdraw = useCallback(
    async (amount: Amount<Token> | undefined) => {
      if (!chainId) return console.error('useMasterChef: chainId not defined')
      if (!amount) return console.error('useMasterChef: amount not defined')

      const data = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: contract.interface.encodeFunctionData(
            chef === Chef.MINICHEF ? 'withdrawAndHarvest' : 'withdraw',
            chef === Chef.MASTERCHEF ? [pid, amount.quotient.toString()] : [pid, amount.quotient.toString(), address]
          ),
        },
      })

      createToast({
        txHash: data.hash,
        href: Chain.from(chainId).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: (
            <Dots>
              Unstaking {amount.toSignificant(6)} {amount.currency.symbol} tokens
            </Dots>
          ),
          completed: `Successfully unstaked ${amount.toSignificant(6)} ${amount.currency.symbol} tokens`,
          failed: `Something went wrong when unstaking ${amount.currency.symbol} tokens`,
        },
      })
    },
    [address, chainId, chef, contract.address, contract.interface, pid, sendTransactionAsync]
  )

  /**
   * @throws {Error}
   */
  const harvest = useCallback(async () => {
    if (!chainId) return console.error('useMasterChef: chainId not defined')
    if (!data) return console.error('useMasterChef: could not fetch pending sushi and sushi balance')

    let tx
    if (chef === Chef.MASTERCHEF) {
      tx = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: contract.interface.encodeFunctionData('deposit', [pid, ZERO]),
        },
      })
    } else if (chef === Chef.MINICHEF) {
      tx = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: contract.interface.encodeFunctionData('harvest', [pid, address]),
        },
      })
    } else {
      if (pendingSushi && sushiBalance && pendingSushi.greaterThan(sushiBalance)) {
        tx = await sendTransactionAsync({
          request: {
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('batch', [
              contract.interface.encodeFunctionData('harvestFromMasterChef'),
              contract.interface.encodeFunctionData('harvest', [pid, address]),
            ]),
          },
        })
      } else {
        tx = await sendTransactionAsync({
          request: {
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('harvest', [pid, address]),
          },
        })
      }
    }

    createToast({
      txHash: tx.hash,
      href: Chain.from(chainId).getTxUrl(tx.hash),
      promise: tx.wait(),
      summary: {
        pending: <Dots>Harvesting rewards</Dots>,
        completed: `Successfully harvested rewards`,
        failed: `Something went wrong when harvesting rewards`,
      },
    })
  }, [
    chainId,
    data,
    chef,
    sendTransactionAsync,
    address,
    contract.address,
    contract.interface,
    pid,
    pendingSushi,
    sushiBalance,
  ])

  return useMemo(() => {
    return {
      deposit,
      withdraw,
      harvest,
      balance,
      isLoading,
      isError,
      pendingSushi,
    }
  }, [balance, deposit, harvest, isError, isLoading, pendingSushi, withdraw])
}
