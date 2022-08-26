import { Result } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { Chain } from '@sushiswap/chain'
import { Amount, SUSHI_ADDRESS, Token } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
import { createToast, Dots } from '@sushiswap/ui'
import { useCallback } from 'react'
import { erc20ABI, useAccount, useContractRead, useSendTransaction } from 'wagmi'

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

interface UseMasterChefReturn extends Omit<ReturnType<typeof useSendTransaction>, 'sendTransactionAsync'> {
  deposit(amount: Amount<Token> | undefined): void
  withdraw(amount: Amount<Token> | undefined): void
  balance: Amount<Token> | undefined
  harvest(): void
}

interface UseMasterChefParams {
  chainId: number | undefined
  chef: Chef
  pid: number
  token: Token
}

type UseMasterChef = (params: UseMasterChefParams) => UseMasterChefReturn

export const useMasterChef: UseMasterChef = ({ chainId, chef, pid, token }) => {
  const { address } = useAccount()
  const contract = useMasterChefContract(chainId, chef)
  const { sendTransactionAsync, ...rest } = useSendTransaction({ chainId })

  const { data: pendingSushi } = useContractRead({
    ...getMasterChefContractV2Config(chainId),
    functionName: 'pendingSushi',
    args: [pid, address],
  })

  const { data: sushiBalance } = useContractRead({
    addressOrName: chainId ? SUSHI_ADDRESS[chainId] : AddressZero,
    functionName: 'balanceOf',
    contractInterface: erc20ABI,
    enabled: Boolean(chainId && SUSHI_ADDRESS[chainId]),
  })

  const { data: balance } = useContractRead({
    ...getMasterChefContractConfig(chainId, chef),
    chainId: contract.chainId,
    functionName: 'userInfo',
    args: [pid, address],
    enabled: !!address,
    select: (data) => Amount.fromRawAmount(token, data?.amount ? data.amount.toString() : 0) as unknown as Result,
  })

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

  const harvest = useCallback(async () => {
    if (!chainId) return console.error('useMasterChef: chainId not defined')

    let data
    if (chef === Chef.MASTERCHEF) {
      data = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: contract.interface.encodeFunctionData('deposit', [pid, ZERO]),
        },
      })
    } else if (chef === Chef.MINICHEF) {
      data = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: contract.interface.encodeFunctionData('harvest', [pid, address]),
        },
      })
    } else {
      if (pendingSushi?.gt(sushiBalance)) {
        data = await sendTransactionAsync({
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
        data = await sendTransactionAsync({
          request: {
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('harvest', [pid, address]),
          },
        })
      }
    }

    createToast({
      txHash: data.hash,
      href: Chain.from(chainId).getTxUrl(data.hash),
      promise: data.wait(),
      summary: {
        pending: <Dots>Harvesting rewards</Dots>,
        completed: `Successfully harvested rewards`,
        failed: `Something went wrong when harvesting rewards`,
      },
    })
  }, [
    address,
    sushiBalance,
    chainId,
    chef,
    contract.address,
    contract.interface,
    pendingSushi,
    pid,
    sendTransactionAsync,
  ])

  return {
    deposit,
    withdraw,
    harvest,
    balance: balance as unknown as Amount<Token> | undefined,
    ...rest,
  }
}
