import type {
  SpotClearinghouseStateResponse,
  SpotMetaResponse,
} from '@nktkas/hyperliquid'
import type { EvmAddress } from 'sushi/evm'
import { formatUnits, parseUnits } from 'viem'

export type SubAccountTransferAsset = {
  token: string
  symbol: string
  decimals: number
  balance: string
}

export type SubAccountTransferDirection = 'to-sub-account' | 'to-master'

function getDecimalPlaces(value: string): number {
  if (!/^-?\d+(?:\.\d+)?$/.test(value)) {
    throw new Error('Unable to read the available spot balance.')
  }
  return value.split('.')[1]?.length ?? 0
}

export function getSubAccountTransferAssets(
  state: SpotClearinghouseStateResponse,
  meta: SpotMetaResponse,
): SubAccountTransferAsset[] {
  const tokens = new Map(meta.tokens.map((token) => [token.index, token]))
  const maintenanceLimits = new Map(state.tokenToAvailableAfterMaintenance)
  const assets: SubAccountTransferAsset[] = []

  for (const balance of state.balances) {
    if (!('token' in balance)) continue
    const token = tokens.get(balance.token)
    if (!token) continue

    const limit = maintenanceLimits.get(balance.token)
    const decimals = Math.max(
      token.weiDecimals,
      getDecimalPlaces(balance.total),
      getDecimalPlaces(balance.hold),
      limit === undefined ? 0 : getDecimalPlaces(limit),
    )
    let available =
      parseUnits(balance.total, decimals) - parseUnits(balance.hold, decimals)
    if (limit !== undefined) {
      const maintenanceAvailable = parseUnits(limit, decimals)
      if (maintenanceAvailable < available) available = maintenanceAvailable
    }

    // Round down only after subtracting holds and applying margin limits.
    const availableWei = available / 10n ** BigInt(decimals - token.weiDecimals)
    if (availableWei <= 0n) continue

    assets.push({
      token: `${token.name}:${token.tokenId}`,
      symbol: token.name,
      decimals: token.weiDecimals,
      balance: formatUnits(availableWei, token.weiDecimals),
    })
  }

  return assets.sort((a, b) => a.symbol.localeCompare(b.symbol))
}

export function getSubAccountTransferAmountError(
  amount: string,
  asset: SubAccountTransferAsset | undefined,
): string | undefined {
  if (!asset) return 'Select an available spot asset.'
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(amount)) {
    return 'Enter an amount greater than zero.'
  }
  const fractionalDigits = (amount.split('.')[1] ?? '').replace(/0+$/, '')
  if (fractionalDigits.length > asset.decimals) {
    return `Use no more than ${asset.decimals} decimal places.`
  }
  const amountWei = parseUnits(amount, asset.decimals)
  if (amountWei <= 0n) return 'Enter an amount greater than zero.'
  if (amountWei > parseUnits(asset.balance, asset.decimals)) {
    return 'Insufficient available balance.'
  }
  return undefined
}

export function getSubAccountTransferRoute({
  masterAddress,
  subAccountAddress,
  direction,
}: {
  masterAddress: EvmAddress
  subAccountAddress: EvmAddress
  direction: SubAccountTransferDirection
}): {
  sourceAddress: EvmAddress
  destination: EvmAddress
  sourceDex: 'spot'
  destinationDex: 'spot'
  fromSubAccount?: EvmAddress
} {
  return {
    sourceAddress:
      direction === 'to-sub-account' ? masterAddress : subAccountAddress,
    destination:
      direction === 'to-sub-account' ? subAccountAddress : masterAddress,
    sourceDex: 'spot',
    destinationDex: 'spot',
    fromSubAccount: direction === 'to-master' ? subAccountAddress : undefined,
  }
}
