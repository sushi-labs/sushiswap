import {
  type SubAccounts2Response,
  type UserNonFundingLedgerUpdatesResponse,
  subAccounts2,
  userNonFundingLedgerUpdates,
} from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'
import { SPOT_ASSETS_TO_REWRITE, perpsNumberFormatter } from '../utils'

const HYPERUNIT_API = 'https://api.hyperunit.xyz'
const ARBITRUM_CHAIN_ID = 42161
const HYPERLIQUID_BRIDGE_CHAIN_ID = 1337
const ARBITRUM_USDC_BRIDGE_FEE = 0.2
const HYPEREVM_SYSTEM_ADDRESS = '0x2222222222222222222222222222222222222222'
const HYPEREVM_SYSTEM_ADDRESS_PREFIX = '0x200000000000000000000000'

type HyperunitOperation = {
  operationId: string
  sourceChain: string
  destinationChain: string
  sourceTxHash: string
  destinationTxHash: string
  protocolAddress: string
  sourceAddress: string
  destinationAddress: string
  asset: string
  sourceAmount: string
  sweepFeeAmount: string
  destinationFeeAmount: string
  state: string
  opCreatedAt: string
  stateStartedAt: string
  stateUpdatedAt: string
  stateNextAttemptAt: string
  broadcastAt: string
}

type HyperunitResponse = {
  addresses: {
    sourceCoinType: string
    destinationChain: string
    address: string
    signatures: Record<string, string>
  }[]
  operations: HyperunitOperation[]
}

type HyperliquidTransfer = {
  depositTxnRef: string | null
  fillTxnRef: string | null
  originChainId: number | null
  destinationChainId: number | null
  amount: string
  token: string
  nonce: string
  destinationBlockTimestamp: string
}

async function getHlTransfers(
  address: EvmAddress,
): Promise<Map<string, HyperliquidTransfer>> {
  const [inRes, outRes] = await Promise.all([
    fetch(
      `https://indexer.api.across.to/hyperliquid-transfers?direction=in&user=${address.toLowerCase()}`,
    ),
    fetch(
      `https://indexer.api.across.to/hyperliquid-transfers?direction=out&user=${address.toLowerCase()}`,
    ),
  ])

  if (!inRes.ok || !outRes.ok) {
    throw new Error('Failed to fetch Hyperliquid transfers')
  }
  const [inData, outData]: [HyperliquidTransfer[], HyperliquidTransfer[]] =
    await Promise.all([inRes.json(), outRes.json()])

  const allTransfers = [...(inData ?? []), ...(outData ?? [])]
  const map = new Map<string, HyperliquidTransfer>()

  for (const transfer of allTransfers) {
    const key = `${transfer.nonce}`.toLowerCase()
    map.set(key, transfer)
  }
  return map
}

function matchHlTransfer(
  tx: UserNonFundingLedgerUpdatesResponse[number],
  hlTransfers: Map<string, HyperliquidTransfer>,
): HyperliquidTransfer | null {
  if (!('nonce' in tx.delta)) return null
  const key = `${tx.delta.nonce}`.toLowerCase()
  return hlTransfers.get(key) || null
}

async function fetchHyperunitOps(
  hlAddress: EvmAddress,
): Promise<Map<string, HyperunitOperation>> {
  const res = await fetch(`${HYPERUNIT_API}/operations/${hlAddress}`)
  if (!res.ok) return new Map()

  const data: HyperunitResponse = await res.json()
  const map = new Map<string, HyperunitOperation>()

  for (const op of data.operations ?? []) {
    const destNonce = op.destinationTxHash.split?.(':')?.[1]?.toLowerCase()
    const srcNonce = op.sourceTxHash.split?.(':')?.[1]?.toLowerCase()
    if (destNonce) {
      map.set(`${destNonce}`, op)
    }
    if (srcNonce) {
      map.set(`${srcNonce}`, op)
    }
  }

  return map
}

function matchHyperunitOp(
  tx: UserNonFundingLedgerUpdatesResponse[number],
  ops: Map<string, HyperunitOperation>,
): HyperunitOperation | null {
  if (!('nonce' in tx.delta)) return null
  const key = `${tx.delta.nonce}`.toLowerCase()

  return ops.get(key) || null
}

const getAddressesFromSubAccounts = (
  subAccounts: SubAccounts2Response,
): Set<string> => {
  if (!subAccounts) return new Set()
  const set = new Set<string>()
  for (const subAccount of subAccounts) {
    set.add(`${subAccount.subAccountUser}`.toLowerCase())
  }
  return set
}

function parseHyperliquidTx(
  tx: UserNonFundingLedgerUpdatesResponse[number],
  myAddress: EvmAddress,
  hyperunitOps: Map<string, HyperunitOperation>,
  hlTransfers: Map<string, HyperliquidTransfer>,
  subAccounts: SubAccounts2Response,
  isVault: boolean,
) {
  const d = tx.delta
  const me = myAddress.toLowerCase()
  const op = matchHyperunitOp(tx, hyperunitOps)
  const hlTransfer = matchHlTransfer(tx, hlTransfers)
  const subAccountAddresses = getAddressesFromSubAccounts(subAccounts)

  if (op && 'fee' in d && 'amount' in d && 'token' in d) {
    const incoming = op.destinationAddress.toLowerCase() === me
    const feeAmount = getHyperunitFeeAmount(op, d.amount)
    const token = formatToken(d.token)

    return {
      action: incoming ? 'Deposit' : 'Withdrawal',
      source: formatChainName(op.sourceChain),
      destination: formatChainName(op.destinationChain),
      feeAmount,
      feeToken: token,
      accountValueChange: incoming
        ? `${perpsNumberFormatter({ value: d.amount })} ${token}`
        : `-${perpsNumberFormatter({ value: d.amount })} ${token}`,
      accValChange: Number(d.amount) * (incoming ? 1 : -1),
    }
  }

  switch (d.type) {
    // ── deposits ──────────────────────────────────────────────────────────
    case 'deposit':
      return {
        action: 'Deposit',
        source: detectBridge(tx), // "Arbitrum" | "HyperEVM"
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(d.usdc),
      }

    // ── withdrawals ───────────────────────────────────────────────────────
    case 'withdraw':
      return {
        action: 'Withdrawal',
        source: 'Perps',
        destination: 'Arbitrum',
        feeAmount: Number(d.fee),
        feeToken: 'USDC',
        accountValueChange: `-${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(-d.usdc),
      }

    // ── internal transfers / spot↔perps moves ─────────────────────────────
    case 'send': {
      const incoming = isSameAddress(d.destination, me)
      const isSelf = isSameAddress(d.user, d.destination)
      const isSubAccount =
        subAccountAddresses.has(d.destination.toLowerCase()) ||
        subAccountAddresses.has(d.user.toLowerCase())
      const isHyperEvmTransfer = isHyperEvmTransferDelta(d)
      const token = formatToken(d.token)
      const fee = getTransferFee(d)
      let action = isSubAccount ? 'Sub-Account Transfer' : 'Send'
      let source = mapDex(d.sourceDex, d.user)
      let destination = mapDex(d.destinationDex, d.destination)
      let feeAmount = fee.feeAmount
      let feeToken = fee.feeToken

      if (!isSubAccount) {
        if (hlTransfer?.destinationChainId === ARBITRUM_CHAIN_ID) {
          action = 'Withdrawal'
          destination = 'Arbitrum'
          const bridgeFee = getArbitrumBridgeFee(d)
          feeAmount = bridgeFee.feeAmount
          feeToken = bridgeFee.feeToken
        } else if (
          incoming &&
          hlTransfer?.originChainId === ARBITRUM_CHAIN_ID
        ) {
          action = 'Deposit'
          source = 'Arbitrum'
          const bridgeFee = getArbitrumBridgeFee(d)
          feeAmount = bridgeFee.feeAmount
          feeToken = bridgeFee.feeToken
        } else if (
          isSelf ||
          isHyperEvmTransfer ||
          hlTransfer?.destinationChainId === HYPERLIQUID_BRIDGE_CHAIN_ID
        ) {
          action = 'Transfer'
        }
      }

      return {
        action,
        source,
        destination,
        feeAmount,
        feeToken,
        accountValueChange: `${incoming ? '' : '-'}${perpsNumberFormatter({
          value: d.amount,
        })} ${token}`,
        accValChange: Number(d.amount) * (incoming ? 1 : -1),
      }
    }

    // ── sub-account transfers ─────────────────────────────────────────────
    case 'subAccountTransfer': {
      const isSending = d.user.toLowerCase() === me
      return {
        action: 'Sub-Account Transfer',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${isSending ? '-' : ''}${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(d.usdc) * (isSending ? -1 : 1),
      }
    }

    // ── accountClassTransfer (Spot ↔ Perps via the "Transfer" button) ──────
    //  toPerp: true  → Spot → Perps  → Source: Spot, Dest: Perps, positive
    //  toPerp: false → Perps → Spot  → Source: Perps, Dest: Spot, negative
    case 'accountClassTransfer':
      return {
        action: 'Transfer',
        source: d.toPerp ? 'Spot' : 'Perps',
        destination: d.toPerp ? 'Perps' : 'Spot',
        feeAmount: 0,
        accountValueChange: `${d.toPerp ? '' : '-'}${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(d.usdc) * (d.toPerp ? 1 : -1),
      }

    // ── internalTransfer (platform-level credit, e.g. referral/fee rebate) ─
    //  Source and destination stay within Perps.
    case 'internalTransfer': {
      const isInternalIncoming = d.destination.toLowerCase() === me
      const isInternalSubAccount =
        subAccountAddresses.has(d.destination.toLowerCase()) ||
        subAccountAddresses.has(d.user.toLowerCase())
      return {
        action: isInternalSubAccount ? 'Sub-Account Transfer' : 'Send',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: Number(d.fee),
        feeToken: 'USDC',
        accountValueChange: `${perpsNumberFormatter({
          value: isInternalIncoming
            ? Number(d.usdc) - Number(d.fee)
            : -Number(d.usdc),
        })} USDC`,
        accValChange: isInternalIncoming
          ? Number(d.usdc) - Number(d.fee)
          : -Number(d.usdc),
      }
    }

    // ── vault deposit ─────────────────────────────────────────────────────
    //  UI: Action "Vault Deposit", Source: Perps, Dest: Perps, negative
    case 'vaultDeposit': {
      const value = isVault ? Number(d.usdc) : -Number(d.usdc)
      return {
        action: 'Vault Deposit',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value })} USDC`,
        accValChange: value,
      }
    }

    // ── vault withdrawal ──────────────────────────────────────────────────
    //  UI: Action "Vault Withdrawal", Source: Perps, Dest: Perps, positive
    //  Use netWithdrawnUsd for the value shown.
    case 'vaultWithdraw': {
      const value = isVault
        ? -(Number(d.netWithdrawnUsd) + Number(d.commission))
        : Number(d.netWithdrawnUsd) + Number(d.commission)
      return {
        action: `Vault Withdrawal`,
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value })} USDC`,
        accValChange: value,
      }
    }

    // ── spot genesis (airdrop / genesis distribution) ─────────────────────
    //  UI: Action "Genesis Distribution", Source: Spot, Dest: Spot, positive
    case 'spotGenesis':
      return {
        action: 'Genesis Distribution',
        source: 'Spot',
        destination: 'Spot',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
        accValChange: Number(d.amount),
      }

    // ── liquidation ───────────────────────────────────────────────────────
    //  Not shown as a row in the deposits/withdrawals table —
    //  it appears in a separate liquidations feed.
    //  Included here for completeness; return null to skip rendering.
    case 'liquidation':
      return {
        action: 'Liquidation',
        source: '--',
        destination: '--',
        feeAmount: 0,
        accountValueChange: `-${perpsNumberFormatter({ value: d.liquidatedNtlPos })}`,
        accValChange: Number(-d.liquidatedNtlPos),
      }

    // ── rewards ───────────────────────────────────────────────────────────
    case 'rewardsClaim':
      return {
        action: 'Rewards Claim',
        source: 'Spot',
        destination: 'Spot',
        fee: '--',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
        accValChange: Number(d.amount),
      }

    // ── earn / borrow-lend supply ─────────────────────────────────────────
    case 'borrowLend': {
      const borrowLendValue =
        d.operation === 'borrow' || d.operation === 'withdraw'
          ? Number(d.amount)
          : -Number(d.amount)
      return {
        action: borrowLendValue < 0 ? 'Supply' : 'Withdrawal',
        source: borrowLendValue < 0 ? 'Spot' : 'Earn',
        destination: borrowLendValue < 0 ? 'Earn' : 'Spot',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({
          value: borrowLendValue,
        })} ${formatToken(d.token)}`,
        accValChange: borrowLendValue,
      }
    }

    // ── staking ───────────────────────────────────────────────────────────
    case 'cStakingTransfer': {
      const stakingValue = d.isDeposit ? -Number(d.amount) : Number(d.amount)
      return {
        action: 'Transfer',
        source: stakingValue > 0 ? 'Staking' : 'Spot',
        destination: stakingValue > 0 ? 'Spot' : 'Staking',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({
          value: stakingValue,
        })} ${formatToken(d.token)}`,
        accValChange: stakingValue,
      }
    }

    // ── spot transfers (HyperEVM ↔ Spot, or external → Spot) ─────────────
    case 'spotTransfer': {
      const incoming = isSameAddress(d.destination, me)
      const isSubAccount =
        subAccountAddresses.has(d.destination.toLowerCase()) ||
        subAccountAddresses.has(d.user.toLowerCase())
      const isHyperEvmTransfer = isHyperEvmTransferDelta(d)
      const token = formatToken(d.token)
      const fee = getTransferFee(d)

      return {
        action: isSubAccount
          ? 'Sub-Account Transfer'
          : isHyperEvmTransfer
            ? 'Transfer'
            : 'Send',
        source: incoming ? (isHyperEvmTransfer ? 'HyperEVM' : 'Spot') : 'Spot',
        destination: incoming
          ? 'Spot'
          : isHyperEvmTransfer
            ? 'HyperEVM'
            : 'Spot',
        feeAmount: fee.feeAmount,
        feeToken: fee.feeToken,
        accountValueChange: incoming
          ? `${perpsNumberFormatter({ value: d.amount })} ${token}`
          : `-${perpsNumberFormatter({ value: d.amount })} ${token}`,
        accValChange: Number(d.amount) * (incoming ? 1 : -1),
      }
    }
    case 'vaultCreate': {
      const isVault = me.toLowerCase() === d.vault.toLowerCase()

      return {
        action: 'Vault Create',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: isVault ? 0 : Number('fee' in d ? d.fee : 0),
        feeToken: 'USDC',
        accountValueChange: `${isVault ? '' : '-'}${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(d.usdc) * (isVault ? 1 : -1),
      }
    }

    case 'vaultDistribution': {
      const amount = Number(d.usdc ?? '0')
      return {
        action: 'Vault Distribution',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({
          value: isVault ? -amount : amount,
        })} USDC`,
        accValChange: amount * (isVault ? -1 : 1),
      }
    }

    case 'deployGasAuction':
      return {
        action: 'Deploy Gas Auction',
        source: 'Spot',
        destination: 'Spot',
        feeAmount: 0,
        accountValueChange: `-${perpsNumberFormatter({ value: d.amount })} ${formatToken(d.token)}`,
        accValChange: Number(-d.amount),
      }

    case 'activateDexAbstraction':
      return {
        action: 'Activate Dex Abstraction',
        source: `Perps (${d.dex})`,
        destination: d.token === 'USDC' ? 'Perps' : 'Spot',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value: d.amount })} ${formatToken(d.token)}`,
        accValChange: Number(d.amount),
      }
    case 'vaultLeaderCommission':
      return {
        action: 'Vault Commission',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(d.usdc),
      }
  }
}

function isSameAddress(
  addressA: string | undefined,
  addressB: string,
): boolean {
  return addressA?.toLowerCase() === addressB.toLowerCase()
}

function isHyperEvmAddress(address: string | undefined): boolean {
  const lowerAddress = address?.toLowerCase()

  return Boolean(
    lowerAddress &&
      (lowerAddress === HYPEREVM_SYSTEM_ADDRESS ||
        lowerAddress.startsWith(HYPEREVM_SYSTEM_ADDRESS_PREFIX)),
  )
}

function isHyperEvmTransferDelta(
  delta: UserNonFundingLedgerUpdatesResponse[number]['delta'],
): boolean {
  if (delta.type !== 'send' && delta.type !== 'spotTransfer') return false

  return isHyperEvmAddress(delta.destination) || isHyperEvmAddress(delta.user)
}

function mapDex(dex: string, address?: string) {
  if (!dex || dex === '') return 'Perps'
  if (dex === 'spot') return isHyperEvmAddress(address) ? 'HyperEVM' : 'Spot'
  return `Perps (${dex})`
}

function formatToken(token: string): string {
  return SPOT_ASSETS_TO_REWRITE.get(token) ?? token
}

function formatChainName(chain: string): string {
  if (chain === 'hyperliquid') return 'Spot'

  return `${chain.charAt(0).toUpperCase()}${chain.slice(1)}`
}

function getTransferFee(
  delta: Extract<
    UserNonFundingLedgerUpdatesResponse[number]['delta'],
    { type: 'send' | 'spotTransfer' }
  >,
): { feeAmount: number; feeToken: string } {
  const nativeTokenFee = Number(delta.nativeTokenFee ?? 0)
  if (nativeTokenFee > 0) {
    return {
      feeAmount: nativeTokenFee,
      feeToken: 'HYPE',
    }
  }

  return {
    feeAmount: Number(delta.fee ?? 0),
    feeToken: delta.feeToken ? formatToken(delta.feeToken) : 'USDC',
  }
}

function getArbitrumBridgeFee(
  delta: Extract<
    UserNonFundingLedgerUpdatesResponse[number]['delta'],
    { type: 'send' | 'spotTransfer' }
  >,
): { feeAmount: number; feeToken: string } {
  const fee = getTransferFee(delta)
  if (fee.feeToken !== 'USDC') {
    return {
      feeAmount: ARBITRUM_USDC_BRIDGE_FEE,
      feeToken: 'USDC',
    }
  }

  return {
    feeAmount: roundFee(fee.feeAmount + ARBITRUM_USDC_BRIDGE_FEE),
    feeToken: 'USDC',
  }
}

function getHyperunitFeeAmount(
  op: HyperunitOperation,
  receivedAmount: number | string,
): number {
  const sourceAmount = Number(op.sourceAmount)
  const sweepFeeAmount = Number(op.sweepFeeAmount)
  const destinationFeeAmount = Number(op.destinationFeeAmount)
  const received = Number(receivedAmount)
  const rawReceived = sourceAmount - sweepFeeAmount - destinationFeeAmount
  const scale = rawReceived / received

  if (!Number.isFinite(scale) || scale <= 0) return 0

  return (sweepFeeAmount + destinationFeeAmount) / scale
}

function roundFee(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function detectBridge(tx: UserNonFundingLedgerUpdatesResponse[number]): string {
  if (tx.delta.type !== 'deposit') return '--'
  return 'Arbitrum'
}

const formatNonFundingLedgerUpdates = (
  data: UserNonFundingLedgerUpdatesResponse,
  address: EvmAddress,
  hyperunitOps: Map<string, HyperunitOperation>,
  hlTransfers: Map<string, HyperliquidTransfer>,
  subAccounts: SubAccounts2Response,
  isVault: boolean,
) => {
  return addVaultLeaderCommissionRows(data).map((item) => {
    return {
      timestamp: item.time,
      status: 'Completed', //no status field in response, assuming all are completed
      ...parseHyperliquidTx(
        item,
        address,
        hyperunitOps,
        hlTransfers,
        subAccounts,
        isVault,
      ),
    }
  })
}

function addVaultLeaderCommissionRows(
  data: UserNonFundingLedgerUpdatesResponse,
): UserNonFundingLedgerUpdatesResponse {
  return data.flatMap((item) => {
    if (
      item.delta.type !== 'vaultWithdraw' ||
      Number(item.delta.commission) <= 0
    ) {
      return [item]
    }

    return [
      item,
      {
        time: item.time - 10,
        hash: item.hash,
        delta: {
          type: 'vaultLeaderCommission',
          user: item.delta.user,
          usdc: String(-Number(item.delta.commission)),
        },
      },
    ]
  })
}

export const useUserNonFundingLedgerUpdates = ({
  address,
  startTime,
  endTime,
  isVault = false,
  isViewAll = false,
  enabled = true,
}: {
  address: EvmAddress | undefined
  startTime?: number
  endTime?: number
  isVault?: boolean
  isViewAll?: boolean
  enabled?: boolean
}) => {
  const queryStartTime = isViewAll ? undefined : startTime
  const queryEndTime = isViewAll ? undefined : endTime

  return useQuery({
    queryKey: [
      'useUserNonFundingLedgerUpdates',
      address,
      queryStartTime,
      queryEndTime,
      isVault,
      isViewAll,
    ],
    queryFn: async ({ signal }) => {
      if (!address) {
        throw new Error('address is undefined')
      }
      const [data, hyperunitOps, hlTransfers, subAccounts] = await Promise.all([
        userNonFundingLedgerUpdates(
          {
            transport: hlHttpTransport,
          },
          {
            user: address,
            startTime: queryStartTime ?? undefined,
            endTime: queryEndTime ?? undefined,
          },
          signal,
        ),
        fetchHyperunitOps(address),
        getHlTransfers(address),
        subAccounts2(
          {
            transport: hlHttpTransport,
          },
          {
            user: address,
          },
          signal,
        ),
      ])
      return formatNonFundingLedgerUpdates(
        data,
        address,
        hyperunitOps,
        hlTransfers,
        subAccounts,
        isVault,
      )
    },
    enabled: Boolean(enabled && address),
  })
}

export type UserNonFundingLedgerUpdatesItemType = ReturnType<
  typeof formatNonFundingLedgerUpdates
>[number]
