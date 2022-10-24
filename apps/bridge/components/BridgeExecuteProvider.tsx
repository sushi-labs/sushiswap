import { Signature } from '@ethersproject/bytes'
import { Amount, Native } from '@sushiswap/currency'
import { useBentoBoxTotal, useSushiXSwapContract } from '@sushiswap/wagmi'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { nanoid } from 'nanoid'
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useCallback, useContext, useState } from 'react'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { useNotifications } from '../lib/state/storage'
import { SushiBridge } from '../lib/SushiBridge'
import { useBridgeState } from './BridgeStateProvider'

interface BridgeExecuteProvider {
  children: ReactNode
}

interface BridgeExecuteContext {
  id: string
  sourceTx: SendTransactionResult | undefined
  setSourceTx: Dispatch<SetStateAction<SendTransactionResult | undefined>>
  gasFee: Amount<Native> | undefined
  execute: (() => void) | undefined
  isWritePending: boolean
  setSignature: Dispatch<SetStateAction<Signature>>
  timestamp: number | undefined
}

const BridgeExecuteContext = createContext<BridgeExecuteContext | undefined>(undefined)

export const BridgeExecuteProvider: FC<BridgeExecuteProvider> = ({ children }) => {
  const { address } = useAccount()
  const [fee, setFee] = useState<Amount<Native>>()
  const [, { createInlineNotification }] = useNotifications(address)
  const [sourceTx, setSourceTx] = useState<SendTransactionResult>()
  const [signature, setSignature] = useState<Signature>()
  const [timestamp, setTimestamp] = useState<number>()
  const { srcChainId, amount, srcToken, dstToken } = useBridgeState()
  const contract = useSushiXSwapContract(srcChainId)
  const srcInputCurrencyRebase = useBentoBoxTotal(srcChainId, srcToken)
  const [nanoId] = useState(nanoid())

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
    [amount, createInlineNotification, srcChainId, srcToken]
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
      nanoId
    )

    return bridge
  }, [address, amount, contract, dstToken, nanoId, signature, srcChainId, srcInputCurrencyRebase, srcToken])

  const prepare = useCallback(
    async (setRequest) => {
      const bridge = prepareBridge()
      if (bridge) {
        console.debug('attempt cook')
        bridge
          .cook(1000000)
          .then((request) => {
            if (request) {
              setRequest(request)
            }
          })
          .catch((err) => {
            console.error('catch err', err)
          })

        try {
          const [fee] = await bridge.getFee(1000000)
          console.log('here')
          setFee(Amount.fromRawAmount(Native.onChain(srcChainId), fee.toString()))
        } catch (e) {
          //
        }
      }
    },
    [prepareBridge, srcChainId]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId: srcChainId,
    prepare,
    onSettled,
    onSuccess: () => setSignature(undefined),
    enabled: Boolean(srcChainId && amount && address && srcInputCurrencyRebase && contract && srcToken && dstToken),
  })

  return (
    <BridgeExecuteContext.Provider
      value={{
        id: nanoId,
        sourceTx,
        setSourceTx,
        isWritePending,
        gasFee: fee,
        execute: sendTransaction,
        setSignature,
        timestamp,
      }}
    >
      {children}
    </BridgeExecuteContext.Provider>
  )
}

export const useBridgeExecute = () => {
  const context = useContext(BridgeExecuteContext)
  if (!context) {
    throw new Error('Hook can only be used inside Bridge Execute Context')
  }

  return context
}
