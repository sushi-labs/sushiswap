import { Signature } from '@ethersproject/bytes'
import { TransactionRequest } from '@ethersproject/providers'
import { Amount, Native } from '@sushiswap/currency'
import { getSushiXSwapContractConfig, useBentoBoxTotal, useSushiXSwapContract } from '@sushiswap/wagmi'
import { nanoid } from 'nanoid'
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAccount, usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { SushiBridge } from '../lib/SushiBridge'
import { useBridgeState } from './BridgeStateProvider'

interface BridgeExecuteProvider {
  children: ReactNode
}

interface BridgeExecuteContext {
  id: string
  txHash: string
  gasFee: Amount<Native> | undefined
  execute(): void
  isWritePending: boolean
  setSignature: Dispatch<SetStateAction<Signature>>
}

const BridgeExecuteContext = createContext<BridgeExecuteContext>(undefined)

export const BridgeExecuteProvider: FC<BridgeExecuteProvider> = ({ children }) => {
  const { address } = useAccount()
  const feeRef = useRef<Amount<Native>>()
  const [txHash, setTxHash] = useState<string>()
  const [signature, setSignature] = useState<Signature>()
  const { srcChainId, amount, srcToken, dstToken, dstChainId, srcTypedAmount } = useBridgeState()
  const contract = useSushiXSwapContract(srcChainId)
  const srcInputCurrencyRebase = useBentoBoxTotal(srcChainId, srcToken)
  const [nanoId] = useState(nanoid())
  const [request, setRequest] = useState<Partial<TransactionRequest & { to: string }>>()

  const { config } = usePrepareSendTransaction({
    ...getSushiXSwapContractConfig(srcChainId),
    request,
    enabled: Boolean(request),
  })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSuccess: (data) => {
      setTxHash(data?.hash)
      setSignature(undefined)
    },
  })

  const prepareBridge = useCallback(() => {
    if (!srcChainId || !amount || !address || !srcInputCurrencyRebase || !contract) {
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

  const prepare = useCallback(() => {
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
    }
  }, [prepareBridge])

  // Prepare tx
  useEffect(() => {
    prepare()
  }, [srcChainId, srcToken, dstToken, dstChainId, srcTypedAmount, prepare])

  useEffect(() => {
    const getFee = async () => {
      try {
        const bridge = prepareBridge()
        if (bridge) {
          const [fee] = await bridge.getFee(1000000)
          feeRef.current = Amount.fromRawAmount(Native.onChain(srcChainId), fee.toString())
        }
      } catch (e) {
        console.log(e)
      }
    }

    void getFee()
  }, [prepareBridge, srcChainId])

  return (
    <BridgeExecuteContext.Provider
      value={{ id: nanoId, txHash, isWritePending, gasFee: feeRef?.current, execute: sendTransaction, setSignature }}
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
