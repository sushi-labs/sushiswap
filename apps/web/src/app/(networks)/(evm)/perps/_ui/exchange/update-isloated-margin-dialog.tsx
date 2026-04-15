'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  DEX_COLLATERAL_TOKENS,
  type UserPositionsItemType,
  formatSize,
  perpsNumberFormatter,
  useSpotMeta,
  useUpdateIsolatedMargin,
} from 'src/lib/perps'
import { useUserState } from '~evm/perps/user-provider'
import { IsolatedMarginInput, SideToggle, StatItem } from '../_common'
import { useUserSettingsState } from '../account-management'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'

export const UpdateIsolatedMarginDialog = ({
  trigger,
  position,
  isOpen,
  onOpenChange,
}: {
  trigger: ReactNode
  position: UserPositionsItemType
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'add' | 'remove'>('add')
  const [amount, setAmount] = useState('')
  const { updateIsolatedMargin, isPending } = useUpdateIsolatedMargin()
  const {
    state: { isUnifiedAccountModeEnabled, isDexAbstractionEnabled },
  } = useUserSettingsState()
  const currentMargin = useMemo(() => {
    return position.position.marginUsed
  }, [position])
  const {
    state: {
      webData2Query: { data: webData2 },
      spotStateQuery: { data: spotState },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const { data: spotMeta } = useSpotMeta()
  const collateralTokenId = useMemo(() => {
    return DEX_COLLATERAL_TOKENS[
      position.perpsDex as keyof typeof DEX_COLLATERAL_TOKENS
    ]?.collateralToken
  }, [position.perpsDex])
  const token = useMemo(() => {
    return spotMeta?.tokens.find((t) => t.index === collateralTokenId)
  }, [collateralTokenId, spotMeta])
  const asset = useMemo(() => {
    return assetList?.get(position.position.coin)
  }, [assetList, position.position.coin])
  const isStrictIsolated = asset?.marginMode === 'strictIsolated'
  const initialMarginRequired = useMemo(() => {
    if (position.position.leverage.type === 'isolated') {
      return position.position.leverage.rawUsd
    }

    const positionValue = Number(position.position.positionValue ?? 0)
    const leverage = position.position.leverage.value

    if (!Number.isFinite(positionValue) || leverage <= 0) return '0'

    return (positionValue / leverage).toString()
  }, [position.position.leverage, position.position.positionValue])

  useEffect(() => {
    if (!isStrictIsolated || type === 'add') return

    setType('add')
    setAmount('')
  }, [isStrictIsolated, type])

  const maxValue = useMemo(() => {
    if (type === 'add') {
      return maxAddableIsolatedMargin({
        collateralTokenId,
        dexWithdrawable: position.clearingHouseDataForDex?.withdrawable,
        isDexAbstractionEnabled,
        isUnifiedAccount: isUnifiedAccountModeEnabled,
        perpsDex: position.perpsDex,
        perpsWithdrawable: webData2?.clearinghouseState?.withdrawable,
        spotBalances:
          spotState?.spotState?.balances ?? webData2?.spotState?.balances,
      })
    }

    return maxRemovableIsolatedMargin({
      canRemove: !isStrictIsolated,
      initialMarginRequired,
      marginUsed: currentMargin,
      positionValue: position.position.positionValue,
    })
  }, [
    currentMargin,
    initialMarginRequired,
    isDexAbstractionEnabled,
    isStrictIsolated,
    isUnifiedAccountModeEnabled,
    position.clearingHouseDataForDex?.withdrawable,
    position.perpsDex,
    type,
    collateralTokenId,
    spotState?.spotState?.balances,
    webData2?.clearinghouseState?.withdrawable,
    webData2?.spotState?.balances,
    position.position.positionValue,
  ])

  const handleMaxAmount = useCallback(() => {
    setAmount(maxValue)
  }, [maxValue])

  const updateData = useMemo(() => {
    if (Number(amount) <= 0) return null
    if (type === 'remove' && isStrictIsolated) return null

    try {
      const data = {
        assetString: position.position.coin,
        side: position.side === 'B' ? ('long' as const) : ('short' as const),
        amount: formatSize(amount, 6),
        isAdd: type === 'add',
      }
      return data
    } catch {
      return null
    }
  }, [amount, isStrictIsolated, position.position.coin, position.side, type])

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent variant="perps-default">
        <DialogHeader>
          <DialogTitle>Adjust Margin</DialogTitle>
          <DialogDescription>
            Decrease the chance of liquidation by adding more margin or remove
            excess margin to use for other positions.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-2">
              <IsolatedMarginInput
                value={amount}
                onChange={setAmount}
                setMax={handleMaxAmount}
                className="!py-0 px-2"
              />
              {isStrictIsolated ? (
                <div className="shrink-0 px-2 text-xs text-muted-foreground">
                  Add only
                </div>
              ) : (
                <SideToggle
                  options={['add', 'remove']}
                  side={type}
                  setSide={setType}
                  baseSymbol="Add"
                  quoteSymbol="Remove"
                />
              )}
            </div>
            {isStrictIsolated ? (
              <p className="text-xs text-muted-foreground">
                This market uses strict isolated margin. Margin can be added but
                not removed from an open position.
              </p>
            ) : null}
            <div className="flex flex-col gap-2">
              <StatItem
                title={`Current Margin for ${position.assetSymbol}`}
                value={`${perpsNumberFormatter({ value: currentMargin ?? '0', minFraxDigits: 2, maxFraxDigits: 2 })} ${token?.name}`}
              />
              <StatItem
                title={`Margin available to ${type}`}
                value={`${perpsNumberFormatter({ value: maxValue ?? '0', minFraxDigits: 2, maxFraxDigits: 2 })} ${token?.name}`}
              />
            </div>
            <PerpsChecker.Legal size="default" variant="perps-default">
              <PerpsChecker.EnableTrading
                size="default"
                variant="perps-default"
              >
                <PerpsChecker.BuilderFee size="default" variant="perps-default">
                  <PerpsChecker.HyperReferral
                    size="default"
                    variant="perps-default"
                  >
                    <Button
                      size="default"
                      variant="perps-default"
                      onClick={() => {
                        if (!updateData) return
                        updateIsolatedMargin(updateData, {
                          onSuccess: () => {
                            handleOpenChange(false)
                            setAmount('')
                          },
                        })
                      }}
                      loading={isPending}
                      disabled={
                        !updateData || Number(amount) > Number(maxValue)
                      }
                    >
                      Confirm
                    </Button>
                  </PerpsChecker.HyperReferral>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function maxRemovableIsolatedMargin({
  canRemove = true,
  initialMarginRequired,
  marginUsed,
  positionValue,
  decimals = 6,
}: {
  canRemove?: boolean
  initialMarginRequired: string
  marginUsed: string
  positionValue: string
  decimals?: number
}) {
  if (!canRemove) return '0'

  const initial = Number(initialMarginRequired)
  const m = Number(marginUsed)
  const total = Number(positionValue)

  if (
    !Number.isFinite(initial) ||
    !Number.isFinite(m) ||
    !Number.isFinite(total)
  )
    return '0'

  const minKeep = Math.max(initial, 0.1 * total)
  const raw = Math.max(0, m - minKeep)
  const factor = 10 ** decimals

  return (Math.floor(raw * factor) / factor).toString()
}

function maxAddableIsolatedMargin({
  collateralTokenId,
  dexWithdrawable,
  isDexAbstractionEnabled,
  isUnifiedAccount,
  perpsDex,
  perpsWithdrawable,
  spotBalances,
}: {
  collateralTokenId: number | undefined
  dexWithdrawable: string | undefined
  isDexAbstractionEnabled: boolean
  isUnifiedAccount: boolean
  perpsDex: string
  perpsWithdrawable: string | undefined
  spotBalances:
    | {
        hold: string
        token: number
        total: string
      }[]
    | undefined
}) {
  if (collateralTokenId === undefined) return '0'

  if (isUnifiedAccount) {
    return getAvailableSpotBalance(spotBalances, collateralTokenId)
  }

  if (isDexAbstractionEnabled && perpsDex !== '') {
    return collateralTokenId === 0
      ? (perpsWithdrawable ?? '0')
      : getAvailableSpotBalance(spotBalances, collateralTokenId)
  }

  return perpsDex === '' ? (perpsWithdrawable ?? '0') : (dexWithdrawable ?? '0')
}

function getAvailableSpotBalance(
  spotBalances:
    | {
        hold: string
        token: number
        total: string
      }[]
    | undefined,
  tokenId: number,
) {
  const balance = spotBalances?.find((entry) => entry.token === tokenId)
  const total = Number(balance?.total ?? 0)
  const hold = Number(balance?.hold ?? 0)

  if (!Number.isFinite(total) || !Number.isFinite(hold)) return '0'

  return Math.max(0, total - hold).toString()
}
