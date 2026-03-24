import {
  type UserNonFundingLedgerUpdatesResponse,
  userNonFundingLedgerUpdates,
} from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

const formatAction = (
  delta: UserNonFundingLedgerUpdatesResponse[number]['delta'],
) => {
  const deltaType = delta.type
  switch (deltaType) {
    case 'accountClassTransfer':
      return 'Transfer'
    case 'activateDexAbstraction':
      return 'Dex Abstraction'
    case 'borrowLend':
      return delta.operation
    case 'cStakingTransfer':
      return 'Transfer'
    case 'deployGasAuction':
      return 'Gas Auction'
    case 'deposit':
      return 'Deposit'
    case 'internalTransfer':
      return 'Transfer'
    case 'liquidation':
      return 'Liquidation'
    case 'rewardsClaim':
      return 'Rewards Claim'
    case 'send':
      return 'Send'
    case 'spotGenesis':
      return 'Transfer'
    case 'spotTransfer':
      return 'Transfer'
    case 'subAccountTransfer':
      return 'Sub-Account Transfer'
    case 'vaultCreate':
      return 'Vault Create'
    case 'vaultDeposit':
      return 'Vault Deposit'
    case 'vaultWithdraw':
      return 'Vault Withdraw'
    case 'vaultDistribution':
      return 'Vault Distribution'
    case 'withdraw':
      return 'Withdraw'
    default:
      return deltaType
  }
}

const formatSource = (item: UserNonFundingLedgerUpdatesResponse[number]) => {
  const delta = item.delta

  if ('sourceDex' in delta) {
    if (delta.sourceDex !== 'spot') {
      return ` Perps${delta.sourceDex ? ` (${delta.sourceDex?.toLowerCase()})` : ''}`
    }

    return 'Spot'
  }

  if (delta.type === 'cStakingTransfer') {
    return 'Spot'
  }
  if (delta.type === 'borrowLend') {
    return 'Spot'
  }
  if (delta.type === 'rewardsClaim') {
    return 'Spot'
  }
  if (delta.type === 'subAccountTransfer') {
    return `Perps`
  }
  if (delta.type === 'deposit') {
    return 'Arbitrum'
  }
  if (delta.type === 'withdraw') {
    return 'Perps'
  }

  return 'Unknown'
}

const formatDestination = (
  item: UserNonFundingLedgerUpdatesResponse[number],
) => {
  const delta = item.delta
  if ('destinationDex' in delta) {
    if (delta.destinationDex !== 'spot') {
      return ` Perps${delta.destinationDex ? ` (${delta.destinationDex.toLowerCase()})` : ''}`
    }
    return 'Spot'
  }
  if (delta.type === 'cStakingTransfer') {
    return 'Staking'
  }
  if (delta.type === 'borrowLend') {
    return 'Spot'
  }
  if (delta.type === 'rewardsClaim') {
    return 'Spot'
  }
  if (delta.type === 'subAccountTransfer') {
    return `Perps`
  }
  if (delta.type === 'deposit') {
    return 'Perps'
  }
  if (delta.type === 'withdraw') {
    if (delta.nonce >= item.time) {
      return 'Arbitrum'
    } else {
      return 'HyperEVM'
    }
  }
  return 'Unknown'
}

const formatAmount = (
  delta: UserNonFundingLedgerUpdatesResponse[number]['delta'],
) => {
  if ('amount' in delta && 'token' in delta) {
    return { amount: delta.amount, token: delta.token }
  }

  if ('usdc' in delta) {
    return { amount: delta.usdc, token: 'USDC' }
  }
  return { amount: '--', token: '' }
}

const formatFee = (
  delta: UserNonFundingLedgerUpdatesResponse[number]['delta'],
) => {
  if (delta.type === 'withdraw') {
    return delta.fee
  }

  return 0
}

const formatChangeType = (
  delta: UserNonFundingLedgerUpdatesResponse[number]['delta'],
  address: EvmAddress,
) => {
  if (
    'destination' in delta &&
    delta.destination.toLowerCase() !== address.toLowerCase()
  ) {
    return 'negative' as const
  }
  if (delta.type === 'withdraw') {
    return 'negative' as const
  }
  if (delta.type === 'cStakingTransfer' && delta.isDeposit) {
    return 'negative' as const
  }
  if (
    delta.type === 'borrowLend' &&
    (delta.operation === 'supply' || delta.operation === 'repay')
  ) {
    return 'negative' as const
  }
  if (
    delta.type === 'send' &&
    delta.destinationDex === 'spot' &&
    delta.sourceDex === 'spot'
  ) {
    return 'negative' as const
  }
  return 'positive' as const
}

const formatNonFundingLedgerUpdates = (
  data: UserNonFundingLedgerUpdatesResponse,
  address: EvmAddress,
) => {
  return data.map((item) => {
    return {
      timestamp: item.time,
      status: 'Completed', //no status field in response, assuming all are completed
      action: formatAction(item.delta),
      source: formatSource(item),
      destination: formatDestination(item),
      accountValChange: formatAmount(item.delta),
      fee: formatFee(item.delta),
      changeType: formatChangeType(item.delta, address),
    }
  })
}

export const useUserNonFundingLedgerUpdates = ({
  address,
  startTime,
  endTime,
}: {
  address: EvmAddress | undefined
  startTime: number
  endTime?: number
}) => {
  return useQuery({
    queryKey: ['useUserNonFundingLedgerUpdates', address, startTime, endTime],
    queryFn: async () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      const data = await userNonFundingLedgerUpdates(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
          startTime,
          endTime: endTime || null,
        },
      )
      return formatNonFundingLedgerUpdates(data, address)
    },
    enabled: !!address,
  })
}

export type UserNonFundingLedgerUpdatesItemType = ReturnType<
  typeof formatNonFundingLedgerUpdates
>[number]
