import { Amount, Native } from '@sushiswap/currency'
import { useBentoBoxTotal, useSushiXSwapContractWithProvider } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { FC, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { useNotifications } from '../lib/state/storage'
import { SushiBridge } from '../lib/SushiBridge'
import { useBridgeState, useBridgeStateActions } from './BridgeStateProvider'

interface BridgeExecuteProvider {
  approved: boolean | undefined
  children({ execute, isWritePending }: { execute: (() => void) | undefined; isWritePending: boolean })
}

export const BridgeExecuteProvider: FC<BridgeExecuteProvider> = ({ approved, children }) => {
  const { address } = useAccount()
  const [, { createInlineNotification }] = useNotifications(address)
  const { setSourceTx, setSignature, setTimestamp, setGasFee } = useBridgeStateActions()
  const { id, signature, srcChainId, amount, srcToken, dstToken } = useBridgeState()
  const contract = useSushiXSwapContractWithProvider(srcChainId)
  const srcInputCurrencyRebase = useBentoBoxTotal(srcChainId, srcToken)

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data || !srcToken || !amount) return

      const ts = new Date().getTime()

      setTimestamp(ts)
      setSourceTx(data)

      createInlineNotification({
        type: 'send',
        chainId: srcChainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Sending ${amount?.toSignificant(6)} ${srcToken.symbol} to Stargate Router`,
          completed: `Send ${amount?.toSignificant(6)} ${srcToken.symbol} to Stargate Router`,
          failed: 'Something went wrong when sending tokens to Stargate Router',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [amount, createInlineNotification, setSourceTx, setTimestamp, srcChainId, srcToken]
  )

  const prepareBridge = useCallback(() => {
    if (!srcChainId || !amount || !address || !srcInputCurrencyRebase || !contract || !srcToken || !dstToken) {
      return
    }

    const srcShare = amount.toShare(srcInputCurrencyRebase)
    const bridge = new SushiBridge({
      contract,
      srcToken,
      dstToken,
      srcUseBentoBox: false,
      dstUseBentoBox: false,
      user: address,
      debug: true,
    })
    if (signature) {
      bridge.srcCooker.setMasterContractApproval(signature)
    }
    bridge.transfer(amount, srcShare)
    bridge.teleport(
      srcToken.wrapped,
      dstToken.wrapped,
      1000000, // TODO: figure out exact extra gas required
      id
    )

    bridge
      .getFee(1000000)
      .then(([fee]) => {
        setGasFee(Amount.fromRawAmount(Native.onChain(srcChainId), fee.toString()))
      })
      .catch((e) => {
        console.log(e)
      })

    return bridge
  }, [address, amount, contract, dstToken, id, setGasFee, signature, srcChainId, srcInputCurrencyRebase, srcToken])

  const prepare = useCallback(
    (setRequest) => {
      const bridge = prepareBridge()
      if (bridge && approved) {
        bridge
          .cook(1000000)
          .then((request) => {
            if (request) setRequest(request)
          })
          .catch((err) => {
            console.error('catch err', err)
          })
      }
    },
    [approved, prepareBridge]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId: srcChainId,
    prepare,
    onSettled,
    onSuccess: () => {
      setSignature(undefined)
    },
    enabled: Boolean(srcChainId && amount && address && srcInputCurrencyRebase && contract && srcToken && dstToken),
  })

  return children({ execute: sendTransaction, isWritePending })
}
