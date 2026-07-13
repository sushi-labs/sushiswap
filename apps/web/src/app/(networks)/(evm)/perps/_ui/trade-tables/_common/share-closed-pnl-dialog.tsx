'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/outline'
import { createErrorToast } from '@sushiswap/notifications'
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
import { XIcon } from '@sushiswap/ui/icons/XIcon'
import {
  type JSX,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  type BalanceItemType,
  type TradeHistoryItemType,
  type TwapFillHistoryItemType,
  type UserPositionsItemType,
  getHyperliquidCoinIconUrl,
  perpsNumberFormatter,
  useActiveAssetData,
  useSushiReferralOverview,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { TableButton } from '../../_common'
import { useAssetListState } from '../../asset-selector'

const SHARE_URL = 'https://www.sushi.com/perps'
const getInviteUrl = (referralCode: string) =>
  `https://www.sushi.com/perps/invite/${referralCode.toUpperCase()}`

export type AnyTradeType =
  | TradeHistoryItemType
  | BalanceItemType
  | UserPositionsItemType
  | TwapFillHistoryItemType

type NormalizedTrade = {
  entryPx: number
  symbol: string
  coin: string
  closedPnl: number
  time: number
  side: 'A' | 'B'
  sz: string
  px: string
  roePc?: number
}

type FillWithPnl = {
  closedPnl: string
  px: string
  side: 'A' | 'B'
  startPosition: string
  sz: string
}

function parseFiniteNumber(value: number | string | null | undefined): number {
  const parsed =
    typeof value === 'number' ? value : Number.parseFloat(value ?? '0')

  return Number.isFinite(parsed) ? parsed : 0
}

function getFillPositionSide(trade: FillWithPnl): 'A' | 'B' {
  const startPosition = parseFiniteNumber(trade.startPosition)

  if (startPosition < 0) return 'A'
  if (startPosition > 0) return 'B'

  return trade.side
}

function getFillEntryPx(trade: FillWithPnl): number {
  const closedPnl = parseFiniteNumber(trade.closedPnl)
  const exitPrice = parseFiniteNumber(trade.px)
  const size = parseFiniteNumber(trade.sz)

  if (size === 0) return exitPrice

  const quotient = closedPnl / size

  return getFillPositionSide(trade) === 'A'
    ? exitPrice + quotient
    : exitPrice - quotient
}

function normalizeTrade(trade: AnyTradeType): NormalizedTrade {
  // UserPositionsItemType —
  if ('position' in trade) {
    const entryPrice = parseFiniteNumber(trade.position.entryPx)
    const side = trade.side === 'A' ? -1 : 1
    const size = parseFiniteNumber(trade.position.szi) * side
    const entryNotional = entryPrice * size
    const leverage = trade.position.leverage.value
    const pnl = parseFiniteNumber(trade.position.unrealizedPnl)
    const roePc =
      entryNotional === 0 ? 0 : (pnl / entryNotional) * (leverage ?? 1) * 100
    return {
      entryPx: entryPrice,
      symbol: trade?.assetSymbol?.split(':')?.[1] || trade?.assetSymbol || '',
      coin: trade.position.coin,
      time: Date.now(),
      closedPnl: pnl,
      side: trade?.side,
      sz: Math.abs(size).toString(),
      px: trade.markPrice,
      roePc,
    }
  }

  // TwapFillHistoryItemType — uses assetSymbol
  if (
    'twapId' in trade &&
    trade.twapId !== null &&
    trade.twapId !== undefined &&
    'assetSymbol' in trade
  ) {
    const closedPnl = parseFiniteNumber(trade.closedPnl)
    const fees = parseFiniteNumber(trade.fee)
    const totalPnl = closedPnl - fees
    const entryPx = getFillEntryPx(trade)
    return {
      entryPx: entryPx,
      symbol: trade?.assetSymbol?.split('/')?.[0] || trade.assetSymbol || '',
      coin: trade.coin,
      time: trade.time,
      closedPnl: totalPnl,
      side: getFillPositionSide(trade),
      sz: trade.sz,
      px: trade.px,
    }
  }

  // BalanceItemType — no pnl fields
  if ('totalBalance' in trade && 'coin' in trade) {
    const size = parseFiniteNumber(trade.totalBalance)
    const price = size === 0 ? 0 : parseFiniteNumber(trade.usdcValue) / size
    const closedPnl = parseFiniteNumber(trade?.pnlRoePc?.pnl)
    const quotient = size === 0 ? 0 : closedPnl / size
    const entryPx = price - quotient
    return {
      entryPx: entryPx,
      symbol: trade.coin,
      coin: trade.assetName || '',
      time: Date.now(),
      closedPnl: closedPnl,
      side: 'B', //can hardcode B here, only spot balances shown here so this has no effect
      sz: size.toString(),
      px: price.toString(),
      roePc: parseFiniteNumber(trade?.pnlRoePc?.roePc),
    }
  }

  // TradeHistoryItemType — full data
  if ('token0Symbol' in trade) {
    const closedPnl = parseFiniteNumber(trade.closedPnl)
    const fees = parseFiniteNumber(trade.fee)
    const totalPnl = closedPnl - fees
    const entryPx = getFillEntryPx(trade)

    return {
      entryPx: entryPx,
      symbol: trade?.token0Symbol ?? '',
      coin: trade.coin,
      closedPnl: totalPnl,
      time: trade.time,
      side: getFillPositionSide(trade),
      sz: trade.sz,
      px: trade.px,
    }
  }

  return {
    entryPx: 0,
    symbol: '',
    coin: '',
    closedPnl: 0,
    time: Date.now(),
    side: 'B',
    sz: '0',
    px: '0',
  }
}

type ShareClosedPnlDialogProps = {
  trade: AnyTradeType
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
}
export function ShareClosedPnlDialog({
  trade,
  isOpen,
  onOpenChange,
  trigger,
}: ShareClosedPnlDialogProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSavingImage, setIsSavingImage] = useState(false)
  const [isSharingImage, setIsSharingImage] = useState(false)
  const posterRef = useRef<HTMLCanvasElement | null>(null)
  const address = useAccount('evm')
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const { data: overview } = useSushiReferralOverview({ address })
  const normalizedTrade = useMemo(() => normalizeTrade(trade), [trade])
  const {
    state: {
      assetListQuery: { data: assetList },
    },
  } = useAssetListState()
  const asset = useMemo(() => {
    return assetList?.get(normalizedTrade.coin)
  }, [assetList, normalizedTrade.coin])

  const { data: assetData } = useActiveAssetData({
    address: activeAddress,
    assetString: normalizedTrade.coin,
  })
  const imageUrl = useMemo(() => {
    return getHyperliquidCoinIconUrl(asset)
  }, [asset])

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

  const leverage = useMemo(() => {
    if (!assetData) return undefined
    return assetData?.leverage?.value
  }, [assetData])
  const referralCode = useMemo(() => {
    if (!overview) return undefined
    return overview?.primaryReferralCode?.code
  }, [overview])

  const totalPnl = useMemo(() => {
    return normalizedTrade.closedPnl
  }, [normalizedTrade.closedPnl])

  const shareText = useMemo(
    () => getDefaultShareText(normalizedTrade, referralCode),
    [normalizedTrade, referralCode],
  )

  useEffect(() => {
    if (!resolvedOpen) {
      setCopied(false)
    }
  }, [resolvedOpen])

  async function handleCopyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(
        referralCode ? getInviteUrl(referralCode) : SHARE_URL,
      )
      setCopied(true)
    } catch {
      createErrorToast('Failed to copy the current page URL.', false, 'perps')
    }
  }

  async function handleSaveImage(): Promise<void> {
    const posterNode = posterRef.current

    if (!posterNode) {
      createErrorToast(
        'Unable to find the share image to export.',
        false,
        'perps',
      )
      return
    }

    setIsSavingImage(true)
    try {
      const blob = await exportPosterBlob(posterNode)
      downloadBlob(blob, getShareImageFileName(normalizedTrade))
    } catch (e) {
      console.error('export failed:', e) // <-- was silently swallowing the error
      createErrorToast('Failed to export the share image.', false, 'perps')
    } finally {
      setIsSavingImage(false)
    }
  }

  async function handleShareOnX(): Promise<void> {
    const posterNode = posterRef.current
    if (!posterNode) {
      createErrorToast(
        'Unable to find the share image to export.',
        false,
        'perps',
      )
      return
    }

    setIsSharingImage(true)
    try {
      const blob = await exportPosterBlob(posterNode)
      const file = new File([blob], getShareImageFileName(normalizedTrade), {
        type: 'image/png',
      })
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        isMobile
      ) {
        await navigator.share({
          files: [file],
          text: shareText,
          title: 'Share closed trade',
          url: referralCode ? getInviteUrl(referralCode) : SHARE_URL,
        })
        return
      }

      const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralCode ? getInviteUrl(referralCode) : SHARE_URL)}`
      window.open(url, '_blank', 'noopener,noreferrer')
      // createErrorToast(
      //   'This browser cannot attach images directly to X. Opened the X composer with text and link instead.',
      //   false,
      // )
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      createErrorToast('Failed to prepare the share image.', false, 'perps')
    } finally {
      setIsSharingImage(false)
    }
  }

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton
            className="inline-flex h-6 w-6 items-center justify-center text-blue hover:text-blue/80"
            aria-label="Share closed trade"
            title="Share closed trade"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </TableButton>
        )}
      </PerpsDialogTrigger>
      <PerpsDialogContent className="md:!max-w-2xl">
        <PerpsDialogHeader>
          <PerpsDialogTitle>Share Your PnL</PerpsDialogTitle>
          <PerpsDialogDescription className="capitalize">
            Share your trade with your friends and followers!
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="mx-auto w-fit max-w-full space-y-8">
            <div className="flex justify-center">
              <SharePoster
                posterRef={posterRef}
                trade={normalizedTrade}
                totalPnl={totalPnl}
                referralCode={referralCode}
                leverage={leverage}
                imageUrl={imageUrl}
              />
            </div>

            <div className="grid w-full gap-3 grid-cols-2">
              <Button
                type="button"
                variant="perps-tertiary"
                icon={ArrowDownTrayIcon}
                loading={isSavingImage}
                onClick={() => {
                  void handleSaveImage()
                }}
              >
                Save Image
              </Button>
              <Button
                type="button"
                variant="perps-tertiary"
                icon={LinkIcon}
                onClick={() => {
                  void handleCopyLink()
                }}
              >
                {copied ? 'Copied Link' : 'Copy Link'}
              </Button>
              <Button
                type="button"
                variant="perps-tertiary"
                className="col-span-2"
                icon={XIcon}
                loading={isSharingImage}
                onClick={() => {
                  void handleShareOnX()
                }}
              >
                Share on X
              </Button>
            </div>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}

const POSTER_WIDTH = 975
const POSTER_HEIGHT = 530
const POSTER_SCALE = 2
const POSTER_CANVAS_WIDTH = POSTER_WIDTH * POSTER_SCALE
const POSTER_CANVAS_HEIGHT = POSTER_HEIGHT * POSTER_SCALE

type SharePosterProps = {
  posterRef: RefObject<HTMLCanvasElement | null>
  trade: NormalizedTrade
  totalPnl: number
  referralCode?: string
  leverage?: number
  imageUrl: string
}

function SharePoster({
  posterRef,
  trade,
  totalPnl,
  referralCode,
  leverage,
  imageUrl,
}: SharePosterProps): JSX.Element {
  const symbol = trade.symbol || trade.coin || 'Asset'
  const leverageMultiplier = leverage
  const direction = trade.side === 'A' ? 'Short' : 'Long'
  const closePrice = Number.parseFloat(trade.px)
  const size = parseFiniteNumber(trade.sz)
  const entryPx =
    Number.isFinite(trade.entryPx) && trade.entryPx > 0
      ? trade.entryPx
      : closePrice
  const entryNotional = entryPx * size
  const pnlPercent =
    'roePc' in trade
      ? Number(trade.roePc)
      : entryNotional === 0
        ? 0
        : (totalPnl / entryNotional) * (leverageMultiplier ?? 1) * 100
  const normalizedPnlPercent = Number.isFinite(pnlPercent) ? pnlPercent : 0
  const isPositive = normalizedPnlPercent >= 0
  const largeValue = `${isPositive ? '+' : ''}${perpsNumberFormatter({
    value: normalizedPnlPercent,
    minFraxDigits: 1,
    maxFraxDigits: 1,
  })}%`
  const leverageLabel = leverageMultiplier
    ? `${leverageMultiplier}x ${direction}`
    : 'Spot'

  const entryPriceLabel = formatPosterPrice(entryPx)
  const exitPriceLabel = formatPosterPrice(closePrice)
  const referralLabel = referralCode?.toUpperCase() || undefined

  useEffect(() => {
    let cancelled = false

    async function renderPoster(): Promise<void> {
      const canvas = posterRef.current
      if (!canvas) return

      const {
        drawPosterCanvas,
        getOptionalPosterImage,
        getPosterArtImages,
        getSushiIconImage,
        loadPosterFont,
      } = await import('./share-closed-pnl-image')
      if (cancelled) return

      const [sushiIcon, tokenIcon, artImages] = await Promise.all([
        getSushiIconImage(),
        getOptionalPosterImage(imageUrl),
        getPosterArtImages(),
        loadPosterFont(),
      ])
      if (cancelled) return

      const context = canvas.getContext('2d')
      if (!context) return

      drawPosterCanvas(context, {
        artImages,
        entryPriceLabel,
        exitPriceLabel,
        isPositive,
        largeValue,
        leverageLabel,
        normalizedPnlPercent,
        referralLabel,
        symbol,
        sushiIcon,
        tokenIcon,
      })
    }

    void renderPoster()

    return () => {
      cancelled = true
    }
  }, [
    entryPriceLabel,
    exitPriceLabel,
    isPositive,
    imageUrl,
    largeValue,
    leverageLabel,
    normalizedPnlPercent,
    posterRef,
    referralLabel,
    symbol,
  ])

  return (
    <div
      className="w-full select-none"
      style={{
        width: 'min(680px, calc(100vw - 48px))',
      }}
    >
      <canvas
        ref={posterRef}
        width={POSTER_CANVAS_WIDTH}
        height={POSTER_CANVAS_HEIGHT}
        className="block h-auto w-full rounded-[12px] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      />
    </div>
  )
}

function getDefaultShareText(
  trade: NormalizedTrade,
  referralCode?: string,
): string {
  const baseText = `Trade $${trade.symbol} perps on @SushiSwap`

  return referralCode
    ? `${baseText} using my referral code ${referralCode}`
    : baseText
}

async function exportPosterBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png', 1)
  })

  if (!blob) {
    throw new Error('Canvas blob unavailable')
  }

  return blob
}

function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = fileName
  anchor.style.display = 'none'

  document.body.appendChild(anchor)
  anchor.click()

  document.body.removeChild(anchor)
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 0)
}

function getShareImageFileName(trade: NormalizedTrade): string {
  return `sushi-perps-${trade.symbol.toLowerCase()}-${trade.time}.png`
}

function formatPosterPrice(price: number): string {
  if (!Number.isFinite(price)) {
    return '--'
  }

  const maxFraxDigits =
    Math.abs(price) >= 10000 ? 0 : Math.abs(price) >= 1 ? 2 : 6
  const minFraxDigits =
    Math.abs(price) >= 10000 ? 0 : Math.abs(price) >= 1 ? 2 : 2

  return `$${perpsNumberFormatter({
    value: price,
    maxFraxDigits,
    minFraxDigits,
  })}`
}
