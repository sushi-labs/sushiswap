'use client'
import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type TokenBalance,
  type UserPositionsItemType,
  formatSize,
  getClearinghouseStateForDex,
  getCollateralTokenForDex,
  perpsNumberFormatter,
  useAllPerpMetas,
  useSpotMeta,
  useUpdateIsolatedMargin,
} from 'src/lib/perps'
import { useUserState } from '~evm/perps/user-provider'
import { IsolatedMarginInput, SideToggle, StatItem } from '../_common'
import { useUserSettingsState } from '../account-management'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'
import {
  getMarginRequiredFromLeverage,
  maxRemovableIsolatedMargin,
} from './isolated-margin-utils'

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
      allDexClearinghouseStateQuery: { data: allDexClearinghouseState },
      spotStateQuery: { data: spotState },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const { data: allPerpMetas } = useAllPerpMetas()
  const { data: spotMeta } = useSpotMeta()
  const collateralTokenId = useMemo(() => {
    return getCollateralTokenForDex(allPerpMetas, position.perpsDex)
  }, [allPerpMetas, position.perpsDex])
  const token = useMemo(() => {
    return spotMeta?.tokens.find((t) => t.index === collateralTokenId)
  }, [collateralTokenId, spotMeta])
  const asset = useMemo(() => {
    return assetList?.get(position.position.coin)
  }, [assetList, position.position.coin])
  const isStrictIsolated = asset?.marginMode === 'strictIsolated'
  const mainClearinghouseState = useMemo(() => {
    return getClearinghouseStateForDex(
      allDexClearinghouseState?.clearinghouseStates,
      '',
    )
  }, [allDexClearinghouseState])
  const marginRequired = useMemo(() => {
    return getMarginRequiredFromLeverage({
      leverage: position.position.leverage.value,
      positionValue: position.position.positionValue,
    })
  }, [position.position.leverage.value, position.position.positionValue])

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
        perpsWithdrawable: mainClearinghouseState?.withdrawable,
        spotBalances: spotState?.spotState?.balances,
      })
    }

    return maxRemovableIsolatedMargin({
      canRemove: !isStrictIsolated,
      marginRequired,
      marginUsed: currentMargin,
      positionValue: position.position.positionValue,
    })
  }, [
    currentMargin,
    isDexAbstractionEnabled,
    isStrictIsolated,
    isUnifiedAccountModeEnabled,
    marginRequired,
    position.clearingHouseDataForDex?.withdrawable,
    position.perpsDex,
    type,
    collateralTokenId,
    spotState?.spotState?.balances,
    mainClearinghouseState?.withdrawable,
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
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>{trigger}</PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Adjust Margin</PerpsDialogTitle>
          <PerpsDialogDescription>
            Decrease the chance of liquidation by adding more margin or remove
            excess margin to use for other positions.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
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
            <PerpsChecker.Legal size="default" variant="perps-tertiary">
              <PerpsChecker.EnableTrading
                size="default"
                variant="perps-tertiary"
              >
                <PerpsChecker.BuilderFee
                  size="default"
                  variant="perps-tertiary"
                >
                  <PerpsChecker.HyperReferral
                    size="default"
                    variant="perps-tertiary"
                  >
                    <Button
                      size="default"
                      variant="perps-tertiary"
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
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
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
  spotBalances: TokenBalance[] | undefined
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
  spotBalances: TokenBalance[] | undefined,
  tokenId: number,
) {
  const balance = spotBalances?.find((entry) => entry.token === tokenId)
  const total = Number(balance?.total ?? 0)
  const hold = Number(balance?.hold ?? 0)

  if (!Number.isFinite(total) || !Number.isFinite(hold)) return '0'

  return Math.max(0, total - hold).toString()
}
