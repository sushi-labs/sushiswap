import { splitSignature } from '@ethersproject/bytes'
import {
  Currency,
  CurrencyAmount,
  JSBI,
  MaxUint256,
  Percent,
  SUSHI,
  Token,
  Trade as V2Trade,
  TradeType,
} from '@sushiswap/core-sdk'
import { DAI, USDC } from 'app/config/tokens'
import { useSingleCallResult } from 'app/lib/hooks/multicall'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo, useState } from 'react'

import { useEIP2612Contract } from './useContract'
import useIsArgentWallet from './useIsArgentWallet'
import useTransactionDeadline from './useTransactionDeadline'

enum PermitType {
  AMOUNT = 1,
  ALLOWED = 2,
}

// 20 minutes to submit after signing
const PERMIT_VALIDITY_BUFFER = 20 * 60

interface PermitInfo {
  type: PermitType
  name: string
  // version is optional, and if omitted, will not be included in the domain
  version?: string
}

// todo: read this information from extensions on token lists or elsewhere (permit registry?)
const PERMITTABLE_TOKENS: {
  [chainId: number]: {
    [checksummedTokenAddress: string]: PermitInfo
  }
} = {
  [1]: {
    [USDC.address]: { type: PermitType.AMOUNT, name: 'USD Coin', version: '2' },
    [DAI.address]: {
      type: PermitType.ALLOWED,
      name: 'Dai Stablecoin',
      version: '1',
    },
    // @ts-ignore TYPE NEEDS FIXING
    [SUSHI[1].address]: { type: PermitType.AMOUNT, name: 'SushiSwap' },
  },
  [4]: {
    ['0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735']: {
      type: PermitType.ALLOWED,
      name: 'Dai Stablecoin',
      version: '1',
    },
    // @ts-ignore TYPE NEEDS FIXING
    [SUSHI[4].address]: { type: PermitType.AMOUNT, name: 'SushiSwap' },
  },
  [3]: {
    // @ts-ignore TYPE NEEDS FIXING
    [SUSHI[3].address]: { type: PermitType.AMOUNT, name: 'SushiSwap' },
    ['0x07865c6E87B9F70255377e024ace6630C1Eaa37F']: {
      type: PermitType.AMOUNT,
      name: 'USD Coin',
      version: '2',
    },
  },
  [5]: {
    // @ts-ignore TYPE NEEDS FIXING
    [SUSHI[5].address]: { type: PermitType.AMOUNT, name: 'SushiSwap' },
  },
  [42]: {
    // @ts-ignore TYPE NEEDS FIXING
    [SUSHI[42].address]: { type: PermitType.AMOUNT, name: 'SushiSwap' },
  },
}

export enum UseERC20PermitState {
  // returned for any reason, e.g. it is an argent wallet, or the currency does not support it
  NOT_APPLICABLE,
  LOADING,
  NOT_SIGNED,
  SIGNED,
}

interface BaseSignatureData {
  v: number
  r: string
  s: string
  deadline: number
  nonce: number
  owner: string
  spender: string
  chainId: number
  tokenAddress: string
  permitType: PermitType
}

export interface StandardSignatureData extends BaseSignatureData {
  amount: string
}

export interface AllowedSignatureData extends BaseSignatureData {
  allowed: true
}

export type SignatureData = StandardSignatureData | AllowedSignatureData

const EIP712_DOMAIN_TYPE = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

const EIP712_DOMAIN_TYPE_NO_VERSION = [
  { name: 'name', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

const EIP2612_TYPE = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
]

const PERMIT_ALLOWED_TYPE = [
  { name: 'holder', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
  { name: 'allowed', type: 'bool' },
]

export function useERC20Permit(
  currencyAmount: CurrencyAmount<Currency> | null | undefined,
  spender: string | null | undefined,
  overridePermitInfo: PermitInfo | undefined | null
): {
  signatureData: SignatureData | null
  state: UseERC20PermitState
  gatherPermitSignature: null | (() => Promise<void>)
} {
  const { account, chainId, library } = useActiveWeb3React()
  const transactionDeadline = useTransactionDeadline()
  const tokenAddress = currencyAmount?.currency?.isToken ? currencyAmount.currency.address : undefined
  const eip2612Contract = useEIP2612Contract(tokenAddress)
  const isArgentWallet = useIsArgentWallet()
  const nonceInputs = useMemo(() => [account ?? undefined], [account])
  const tokenNonceState = useSingleCallResult(eip2612Contract, 'nonces', nonceInputs)

  const permitInfo =
    overridePermitInfo ?? (chainId && tokenAddress ? PERMITTABLE_TOKENS[chainId]?.[tokenAddress] : undefined)

  const [signatureData, setSignatureData] = useState<SignatureData | null>(null)

  return useMemo(() => {
    if (
      isArgentWallet ||
      !currencyAmount ||
      !eip2612Contract ||
      !account ||
      !chainId ||
      !transactionDeadline ||
      !library ||
      !tokenNonceState.valid ||
      !tokenAddress ||
      !spender ||
      !permitInfo
    ) {
      return {
        state: UseERC20PermitState.NOT_APPLICABLE,
        signatureData: null,
        gatherPermitSignature: null,
      }
    }

    const nonceNumber = tokenNonceState.result?.[0]?.toNumber()
    if (tokenNonceState.loading || typeof nonceNumber !== 'number') {
      return {
        state: UseERC20PermitState.LOADING,
        signatureData: null,
        gatherPermitSignature: null,
      }
    }

    const isSignatureDataValid =
      signatureData &&
      signatureData.owner === account &&
      signatureData.deadline >= transactionDeadline.toNumber() &&
      signatureData.tokenAddress === tokenAddress &&
      signatureData.nonce === nonceNumber &&
      signatureData.spender === spender &&
      ('allowed' in signatureData || JSBI.equal(JSBI.BigInt(signatureData.amount), currencyAmount.quotient))

    return {
      state: isSignatureDataValid ? UseERC20PermitState.SIGNED : UseERC20PermitState.NOT_SIGNED,
      signatureData: isSignatureDataValid ? signatureData : null,
      gatherPermitSignature: async function gatherPermitSignature() {
        const allowed = permitInfo.type === PermitType.ALLOWED
        const signatureDeadline = transactionDeadline.toNumber() + PERMIT_VALIDITY_BUFFER
        const value = currencyAmount.quotient.toString()

        const message = allowed
          ? {
              holder: account,
              spender,
              allowed,
              nonce: nonceNumber,
              expiry: signatureDeadline,
            }
          : {
              owner: account,
              spender,
              value,
              nonce: nonceNumber,
              deadline: signatureDeadline,
            }
        const domain = permitInfo.version
          ? {
              name: permitInfo.name,
              version: permitInfo.version,
              verifyingContract: tokenAddress,
              chainId,
            }
          : {
              name: permitInfo.name,
              verifyingContract: tokenAddress,
              chainId,
            }
        const data = JSON.stringify({
          types: {
            EIP712Domain: permitInfo.version ? EIP712_DOMAIN_TYPE : EIP712_DOMAIN_TYPE_NO_VERSION,
            Permit: allowed ? PERMIT_ALLOWED_TYPE : EIP2612_TYPE,
          },
          domain,
          primaryType: 'Permit',
          message,
        })

        return library
          .send('eth_signTypedData_v4', [account, data])
          .then(splitSignature)
          .then((signature) => {
            setSignatureData({
              v: signature.v,
              r: signature.r,
              s: signature.s,
              deadline: signatureDeadline,
              ...(allowed ? { allowed } : { amount: value }),
              nonce: nonceNumber,
              chainId,
              owner: account,
              spender,
              tokenAddress,
              permitType: permitInfo.type,
            })
          })
      },
    }
  }, [
    isArgentWallet,
    currencyAmount,
    eip2612Contract,
    account,
    chainId,
    transactionDeadline,
    library,
    tokenNonceState.valid,
    tokenNonceState.result,
    tokenNonceState.loading,
    tokenAddress,
    spender,
    permitInfo,
    signatureData,
  ])
}

const REMOVE_V2_LIQUIDITY_PERMIT_INFO: PermitInfo = {
  version: '1',
  name: 'SushiSwap LP Token',
  type: PermitType.AMOUNT,
}

export function useV2LiquidityTokenPermit(
  liquidityAmount: CurrencyAmount<Token> | null | undefined,
  spender: string | null | undefined
) {
  return useERC20Permit(liquidityAmount, spender, REMOVE_V2_LIQUIDITY_PERMIT_INFO)
}

export function useTridentLiquidityTokenPermit(liquidityAmount?: CurrencyAmount<Token>, spender?: string) {
  const eip2612Contract = useEIP2612Contract(liquidityAmount?.currency.address)
  const name = useSingleCallResult(eip2612Contract, 'name')
  const parsedName = useMemo<string | undefined>(() => (name?.result?.length ? name?.result[0] : undefined), [name])

  return useERC20Permit(
    liquidityAmount ? CurrencyAmount.fromRawAmount(liquidityAmount.currency, MaxUint256) : undefined,
    spender,
    {
      version: '1',
      name: parsedName ?? '',
      type: PermitType.AMOUNT,
    }
  )
}

export function useERC20PermitFromTrade(
  trade: V2Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent
) {
  const { chainId } = useActiveWeb3React()

  const amountToApprove = useMemo(
    () => (trade ? trade.maximumAmountIn(allowedSlippage) : undefined),
    [trade, allowedSlippage]
  )

  return useERC20Permit(
    amountToApprove,
    // v2 router does not support
    trade instanceof V2Trade ? undefined : trade,
    null
  )
}
