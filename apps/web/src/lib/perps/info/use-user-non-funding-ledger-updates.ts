import {
  type SubAccounts2Response,
  type UserNonFundingLedgerUpdatesResponse,
  subAccounts2,
  userNonFundingLedgerUpdates,
} from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'
import { perpsNumberFormatter } from '../utils'

const HYPERUNIT_API = 'https://api.hyperunit.xyz'

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
) {
  const d = tx.delta
  const me = myAddress.toLowerCase()
  const op = matchHyperunitOp(tx, hyperunitOps)
  const hlTransfer = matchHlTransfer(tx, hlTransfers)
  const subAccountAddresses = getAddressesFromSubAccounts(subAccounts)

  if (hlTransfer && 'fee' in d && 'amount' in d && 'token' in d) {
    const incoming = hlTransfer.destinationChainId === 1337
    return {
      action: 'Transfer',
      source: incoming ? 'HyperEVM' : 'Spot',
      destination: incoming ? 'Spot' : 'HyperEVM',
      feeAmount: Number(d.fee),
      accountValueChange: incoming
        ? `${perpsNumberFormatter({ value: d.amount })} ${d.token}`
        : `-${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
      accValChange: Number(d.amount) * (incoming ? 1 : -1),
    }
  }

  if (op && 'fee' in d && 'amount' in d && 'token' in d) {
    const incoming = op.destinationAddress.toLowerCase() === me
    return {
      action: 'Deposit',
      source:
        op.sourceChain === 'hyperliquid'
          ? 'Spot'
          : `${op.sourceChain.charAt(0).toUpperCase()}${op.sourceChain.slice(1)}`,
      destination:
        op.destinationChain === 'hyperliquid'
          ? 'Spot'
          : `${op.destinationChain.charAt(0).toUpperCase()}${op.destinationChain.slice(1)}`,
      feeAmount: Number(d.fee),
      accountValueChange: incoming
        ? `${perpsNumberFormatter({ value: d.amount })} ${d.token}`
        : `-${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
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
        feeAmount: Number(-d.fee),
        accountValueChange: `-${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(-d.usdc),
      }

    // ── internal transfers / spot↔perps moves ─────────────────────────────
    case 'send': {
      const src = mapDex(d.sourceDex)
      const dst = mapDex(d.destinationDex)
      const isSelf = d.user.toLowerCase() === d.destination.toLowerCase()
      const isMe = d.destination.toLowerCase() === me
      const sign = src === 'Perps' || isSelf ? '' : '-'
      const isSubAccount =
        subAccountAddresses.has(d.destination.toLowerCase()) ||
        subAccountAddresses.has(d.user.toLowerCase())

      const incoming = isMe
      if (!isSelf) {
        // Cross-address send — show from viewer's perspective
        return {
          action: isSubAccount
            ? 'Sub-Account Transfer'
            : incoming
              ? 'Deposit'
              : 'Send',
          source: src === 'spot' ? 'HyperEVM' : src || 'Perps',
          destination: dst === 'spot' ? 'HyperEVM' : dst || 'Perps',
          feeAmount: 0,
          accountValueChange: incoming
            ? `${perpsNumberFormatter({ value: d.amount })} ${d.token}`
            : `-${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
          accValChange: Number(d.amount) * (incoming ? 1 : -1),
        }
      }

      // Self-transfer = spot↔perps or spot↔xyz move
      return {
        action: isSubAccount ? 'Sub-Account Transfer' : 'Transfer',
        source: src || 'Perps',
        destination: dst || 'Perps',
        feeAmount: 0,
        accountValueChange: `${sign}${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
        accValChange: Number(d.amount) * (sign === '' ? 1 : -1),
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
    //  Always incoming to the viewer; source is "Perps", dest is "Perps".
    case 'internalTransfer':
      return {
        action: 'Internal Transfer',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: Number(-d.fee),
        accountValueChange: `${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(d.usdc),
      }

    // ── vault deposit ─────────────────────────────────────────────────────
    //  UI: Action "Vault Deposit", Source: Perps, Dest: Perps, negative
    case 'vaultDeposit':
      return {
        action: 'Vault Deposit',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `-${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(-d.usdc),
      }

    // ── vault withdrawal ──────────────────────────────────────────────────
    //  UI: Action "Vault Withdrawal", Source: Perps, Dest: Perps, positive
    //  Use netWithdrawnUsd for the value shown.
    case 'vaultWithdraw':
      return {
        action: 'Vault Withdrawal',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value: d.netWithdrawnUsd })} USDC`,
        accValChange: Number(d.netWithdrawnUsd),
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
    case 'borrowLend':
      return {
        action: 'Supply',
        source: 'Spot',
        destination: 'Earn',
        feeAmount: 0,
        accountValueChange: `-${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
        accValChange: Number(-d.amount),
      }

    // ── staking ───────────────────────────────────────────────────────────
    case 'cStakingTransfer':
      return {
        action: 'Transfer',
        source: 'Spot',
        destination: 'Staking',
        feeAmount: 0,
        accountValueChange: `-${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
        accValChange: Number(-d.amount),
      }

    // ── spot transfers (HyperEVM ↔ Spot, or external → Spot) ─────────────
    case 'spotTransfer': {
      const incoming = d.destination.toLowerCase() === me

      return {
        action: incoming ? 'Deposit' : 'Transfer',
        source: incoming ? 'HyperEVM' : 'Spot',
        destination: incoming ? 'Spot' : 'HyperEVM',
        feeAmount: Number(d.fee),
        accountValueChange: incoming
          ? `${perpsNumberFormatter({ value: d.amount })} ${d.token}`
          : `-${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
        accValChange: Number(d.amount) * (incoming ? 1 : -1),
      }
    }
    case 'vaultCreate':
      return {
        action: 'Vault Create',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `-${perpsNumberFormatter({ value: d.usdc })} USDC`,
        accValChange: Number(-d.usdc),
      }

    case 'vaultDistribution': {
      const amount = Number(d.usdc ?? '0')
      return {
        action: 'Vault Distribution',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${amount >= 0 ? '' : '-'}${perpsNumberFormatter({ value: Math.abs(amount).toString() })} USDC`,
        accValChange: amount,
      }
    }

    case 'deployGasAuction':
      return {
        action: 'Deploy Gas Auction',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `-${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
        accValChange: Number(-d.amount),
      }

    case 'activateDexAbstraction':
      return {
        action: 'Activate Dex Abstraction',
        source: 'Perps',
        destination: 'Perps',
        feeAmount: 0,
        accountValueChange: `${perpsNumberFormatter({ value: d.amount })} ${d.token}`,
        accValChange: Number(-d.amount),
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

function mapDex(dex: string) {
  if (!dex || dex === '') return 'Perps'
  if (dex === 'spot') return 'Spot'
  return `Perps (${dex})`
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
) => {
  return data.map((item) => {
    return {
      timestamp: item.time,
      status: 'Completed', //no status field in response, assuming all are completed
      ...parseHyperliquidTx(
        item,
        address,
        hyperunitOps,
        hlTransfers,
        subAccounts,
      ),
    }
  })
}

export const useUserNonFundingLedgerUpdates = ({
  address,
  startTime,
  endTime,
}: {
  address: EvmAddress | undefined
  startTime?: number
  endTime?: number
}) => {
  return useQuery({
    queryKey: ['useUserNonFundingLedgerUpdates', address, startTime, endTime],
    queryFn: async () => {
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
            startTime: startTime || undefined,
            endTime: endTime || undefined,
          },
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
        ),
      ])
      return formatNonFundingLedgerUpdates(
        data,
        address,
        hyperunitOps,
        hlTransfers,
        subAccounts,
      )
    },
    enabled: !!address,
  })
}

export type UserNonFundingLedgerUpdatesItemType = ReturnType<
  typeof formatNonFundingLedgerUpdates
>[number]
