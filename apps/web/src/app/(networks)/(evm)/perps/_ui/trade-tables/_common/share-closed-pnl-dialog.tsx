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

function normalizeTrade(trade: AnyTradeType): NormalizedTrade {
  // UserPositionsItemType —
  if ('position' in trade) {
    const entryPrice = Number.parseFloat(trade.position.entryPx)
    const side = trade.side === 'A' ? -1 : 1
    const size = Number.parseFloat(trade.position.szi) * side
    const entryNotional = entryPrice * size
    const leverage = trade.position.leverage.value
    const pnl = Number.parseFloat(trade.position.unrealizedPnl ?? '0')
    const roePc = (pnl / entryNotional) * (leverage ?? 1) * 100
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
  if ('twapId' in trade && !!trade?.twapId && 'assetSymbol' in trade) {
    const closedPnl = Number.parseFloat(trade.closedPnl)
    const fees = Number.parseFloat(trade.fee)
    const totalPnl = closedPnl - fees
    const exitPrice = Number.parseFloat(trade.px)
    const size = Number.parseFloat(trade.sz)
    const quotient = closedPnl / size
    const entryPx = exitPrice - quotient
    return {
      entryPx: entryPx,
      symbol: trade?.assetSymbol?.split('/')?.[0] || trade.assetSymbol || '',
      coin: trade.coin,
      time: trade.time,
      closedPnl: totalPnl,
      side: trade?.side,
      sz: trade.sz,
      px: trade.px,
    }
  }

  // BalanceItemType — no pnl fields
  if ('totalBalance' in trade && 'coin' in trade) {
    const size = Number.parseFloat(trade.totalBalance || '0')
    const price = Number.parseFloat(trade.usdcValue) / size
    const closedPnl = trade?.pnlRoePc?.pnl ?? 0
    const quotient = closedPnl / size
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
      roePc: trade?.pnlRoePc?.roePc ?? 0,
    }
  }

  // TradeHistoryItemType — full data
  if ('token0Symbol' in trade) {
    const closedPnl = Number.parseFloat(trade.closedPnl)
    const fees = Number.parseFloat(trade.fee)
    const totalPnl = closedPnl - fees
    const exitPrice = Number.parseFloat(trade.px)
    const size = Number.parseFloat(trade.sz)
    const quotient = closedPnl / size
    const entryPx = exitPrice - quotient

    return {
      entryPx: entryPx,
      symbol: trade?.token0Symbol ?? '',
      coin: trade.coin,
      closedPnl: totalPnl,
      time: trade.time,
      side: trade?.side === 'A' ? 'B' : 'A',
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
    address,
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
const POSTER_SCALE = 1
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
  const size = Number.parseFloat(trade.sz)
  const entryPrice = trade.entryPx
  const entryNotional = entryPrice * size
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

  const entryPx = trade?.entryPx || closePrice - trade.closedPnl / size
  const entryPriceLabel = formatPosterPrice(entryPx)
  const exitPriceLabel = formatPosterPrice(closePrice)
  const referralLabel = referralCode?.toUpperCase() || undefined

  useEffect(() => {
    let cancelled = false

    async function renderPoster(): Promise<void> {
      const canvas = posterRef.current
      if (!canvas) return

      if ('fonts' in document) {
        await document.fonts.ready
      }

      const [sushiIcon, tokenIcon, artImages] = await Promise.all([
        getSushiIconImage(),
        getOptionalPosterImage(imageUrl),
        getPosterArtImages(),
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

let sushiIconPromise: Promise<HTMLImageElement> | null = null
let posterArtImagesPromise: Promise<PosterArtImages> | null = null

function getSushiIconImage(): Promise<HTMLImageElement> {
  if (!sushiIconPromise) {
    sushiIconPromise = new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Image failed to load'))
      image.src = '/sushi-labs-white-icon.svg'
    })
  }

  return sushiIconPromise
}

function getPosterImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Image failed to load: ${src}`))
    image.src = src
  })
}

function getPosterArtImages(): Promise<PosterArtImages> {
  if (!posterArtImagesPromise) {
    posterArtImagesPromise = Promise.all([
      getPosterImage('/perps/bamboo.png'),
      getPosterImage('/perps/chopsticks.png'),
      getPosterImage('/perps/pnl-card-header.png'),
      getPosterImage('/perps/pnl-card-neg-corner.png'),
      getPosterImage('/perps/pnl-card-pos-corner.png'),
      getPosterImage('/perps/sake.png'),
    ]).then(
      ([
        bamboo,
        chopsticks,
        pnlCardHeader,
        pnlCardNegCorner,
        pnlCardPosCorner,
        sake,
      ]) => ({
        bamboo,
        chopsticks,
        pnlCardHeader,
        pnlCardNegCorner,
        pnlCardPosCorner,
        sake,
      }),
    )
  }

  return posterArtImagesPromise
}

function getOptionalPosterImage(
  src: string,
): Promise<HTMLImageElement | undefined> {
  if (!src) {
    return Promise.resolve(undefined)
  }

  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(undefined)
    image.src = `/api/proxy-image?url=${encodeURIComponent(src)}`
  })
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

type PosterArtImages = {
  bamboo: HTMLImageElement
  chopsticks: HTMLImageElement
  pnlCardHeader: HTMLImageElement
  pnlCardNegCorner: HTMLImageElement
  pnlCardPosCorner: HTMLImageElement
  sake: HTMLImageElement
}

type PosterCanvasData = {
  artImages: PosterArtImages
  entryPriceLabel: string
  exitPriceLabel: string
  isPositive: boolean
  leverageLabel: string
  largeValue: string
  referralLabel: string | undefined
  symbol: string
  sushiIcon: HTMLImageElement
  tokenIcon?: HTMLImageElement
}

type PosterTheme = {
  accent: string
  accentDeep: string
  accentMuted: string
  backgroundTintEnd: string
  backgroundTintStart: string
  badgeFill: string
  badgeStroke: string
  panelBorderWidth: number
  panelDropShadowBlur: number
  panelDropShadowColor: string
  panelDropShadowOffsetY: number
  panelEnd: string
  panelGlowBlur: number
  panelGlowColor: string
  panelInsetShadowBlur: number
  panelInsetShadowColor: string
  panelInsetShadowOffsetY: number
  panelStart: string
  panelStroke: string
  percentGradientEnd: string
  percentGradientStart: string
}

const POSITIVE_POSTER_THEME: PosterTheme = {
  accent: '#3AF58C',
  accentDeep: '#0C4B32',
  accentMuted: 'rgba(58, 245, 140, 0.18)',
  backgroundTintEnd: 'rgba(82, 250, 141, 0.016)',
  backgroundTintStart: 'rgba(82, 250, 141, 0.16)',
  badgeFill: 'rgba(58, 245, 140, 0.16)',
  badgeStroke: 'rgba(89, 255, 164, 0.34)',
  panelBorderWidth: 0.5,
  panelDropShadowBlur: 38.86,
  panelDropShadowColor: '#0000001F',
  panelDropShadowOffsetY: 24,
  panelEnd: 'rgba(82, 250, 141, 0.24)',
  panelGlowBlur: 12,
  panelGlowColor: '#52FA8D40',
  panelInsetShadowBlur: 6.48,
  panelInsetShadowColor: '#FFFFFF80',
  panelInsetShadowOffsetY: 6.48,
  panelStart: 'rgba(82, 250, 141, 0.024)',
  panelStroke: '#EDF1F380',
  percentGradientEnd: 'rgba(82, 250, 141, 0.85)',
  percentGradientStart: '#52FA8D',
}
const NEGATIVE_POSTER_THEME: PosterTheme = {
  accent: '#FF6F88',
  accentDeep: '#65303C',
  accentMuted: 'rgba(255, 111, 136, 0.18)',
  backgroundTintEnd: 'rgba(251, 113, 133, 0.016)',
  backgroundTintStart: 'rgba(251, 113, 133, 0.16)',
  badgeFill: 'rgba(255, 111, 136, 0.16)',
  badgeStroke: 'rgba(255, 137, 159, 0.34)',
  panelBorderWidth: 0.5,
  panelDropShadowBlur: 38.86,
  panelDropShadowColor: '#0000001F',
  panelDropShadowOffsetY: 24,
  panelEnd: 'rgba(251, 113, 133, 0.24)',
  panelGlowBlur: 12,
  panelGlowColor: '#FB718540',
  panelInsetShadowBlur: 6.48,
  panelInsetShadowColor: '#FFFFFF80',
  panelInsetShadowOffsetY: 6.48,
  panelStart: 'rgba(251, 113, 133, 0.024)',
  panelStroke: '#EDF1F380',
  percentGradientEnd: 'rgba(251, 113, 133, 0.85)',
  percentGradientStart: '#FB7185',
}

function drawPosterCanvas(
  context: CanvasRenderingContext2D,
  data: PosterCanvasData,
): void {
  context.clearRect(0, 0, POSTER_CANVAS_WIDTH, POSTER_CANVAS_HEIGHT)
  context.save()
  context.scale(POSTER_SCALE, POSTER_SCALE)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  context.beginPath()
  createRoundedRectPath(context, 0, 0, POSTER_WIDTH, POSTER_HEIGHT, 24)
  context.clip()

  const theme = getPosterTheme(data.isPositive)

  drawPosterBackground(context, theme)
  drawPosterHeaderImage(context, data.artImages.pnlCardHeader)
  drawPosterHeader(context, data.sushiIcon)
  drawPosterPnlPanel(context, data, theme)
  drawPosterArt(context, data.artImages, data.isPositive)
  drawPosterStats(context, data)

  context.restore()
}

function getPosterTheme(isPositive: boolean): PosterTheme {
  return isPositive ? POSITIVE_POSTER_THEME : NEGATIVE_POSTER_THEME
}

function drawPosterBackground(
  context: CanvasRenderingContext2D,
  theme: PosterTheme,
): void {
  context.fillStyle = '#0D1217'
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)

  const tintGradient = context.createLinearGradient(0, POSTER_HEIGHT, 0, 0)
  tintGradient.addColorStop(0, theme.backgroundTintStart)
  tintGradient.addColorStop(1, theme.backgroundTintEnd)
  context.fillStyle = tintGradient
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)
}

function drawPosterHeaderImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
): void {
  context.save()
  context.globalAlpha = 0.72
  context.drawImage(image, 0, 0, POSTER_WIDTH, 143)
  context.restore()
}

function drawPosterArt(
  context: CanvasRenderingContext2D,
  artImages: PosterArtImages,
  isPositive: boolean,
): void {
  if (isPositive) {
    drawPositivePosterArt(context, artImages)
  } else {
    drawNegativePosterArt(context, artImages)
  }
}

function drawPosterHeader(
  context: CanvasRenderingContext2D,
  sushiIcon: HTMLImageElement,
): void {
  context.save()
  context.drawImage(sushiIcon, 42, 35, 40, 34)
  context.fillStyle = '#FFFFFF'
  context.font = '700 35px Inter, sans-serif'
  context.textBaseline = 'middle'
  context.fillText('Sushi', 94, 53)
  context.restore()
}

function drawPosterStats(
  context: CanvasRenderingContext2D,
  data: PosterCanvasData,
): void {
  const statY = 105
  drawPosterStat(context, 'Entry price', data.entryPriceLabel, 44, statY)
  drawPosterStat(context, 'Exit price', data.exitPriceLabel, 168, statY)
  if (data.referralLabel) {
    drawPosterStat(context, 'Referral code', data.referralLabel, 292, statY)
  }
}

function drawPosterStat(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
): void {
  context.save()
  context.textBaseline = 'top'
  context.fillStyle = 'rgba(255, 255, 255, 0.52)'
  context.font = '500 18px Inter, sans-serif'
  context.fillText(label, x, y)
  context.fillStyle = '#FFFFFF'
  context.font = '700 20px Inter, sans-serif'
  context.fillText(value, x, y + 31)
  context.restore()
}

function drawPosterPnlPanel(
  context: CanvasRenderingContext2D,
  data: PosterCanvasData,
  theme: PosterTheme,
): void {
  const x = 44
  const y = 200
  const width = 445
  const height = 280
  const radius = 56
  const panelGradient = context.createLinearGradient(0, y + height, 0, y)

  panelGradient.addColorStop(0, theme.panelStart)
  panelGradient.addColorStop(1, theme.panelEnd)

  context.save()

  drawPanelOuterShadow(
    context,
    x,
    y,
    width,
    height,
    radius,
    theme.panelDropShadowColor,
    theme.panelDropShadowBlur,
    theme.panelDropShadowOffsetY,
  )
  drawPanelOuterShadow(
    context,
    x,
    y,
    width,
    height,
    radius,
    theme.panelGlowColor,
    theme.panelGlowBlur,
    0,
  )

  context.fillStyle = panelGradient
  fillRoundedRect(context, x, y, width, height, radius)

  drawPanelCornerImage(
    context,
    data.isPositive
      ? data.artImages.pnlCardPosCorner
      : data.artImages.pnlCardNegCorner,
    x - 135,
    y - 120,
    x,
    y,
    width * 1.6,
    height * 1.6,
    width,
    height,
    radius,
  )
  drawPanelInsetShadow(context, x, y, width, height, radius, theme)
  drawPanelInsetEdgeShadows(context, x, y, width, height, radius)
  drawPanelBorder(context, x, y, width, height, radius, theme)

  const tokenBadgeWidth = drawTokenBadge(
    context,
    data.symbol,
    data.tokenIcon,
    x + 44,
    y + 44,
    theme,
  )
  drawLeverageBadge(
    context,
    data.leverageLabel,
    x + 44 + tokenBadgeWidth + 12,
    y + 44,
    theme,
  )

  drawPosterPercent(context, data.largeValue, x + 44, y + 126, 358, theme)
  context.restore()
}

function drawPanelCornerImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  realX: number,
  realY: number,
  width: number,
  height: number,
  realWidth: number,
  realHeight: number,
  radius: number,
): void {
  const intrinsicWidth = image.naturalWidth || image.width
  const intrinsicHeight = image.naturalHeight || image.height
  const imageWidth = width * 0.98
  const imageHeight = imageWidth * (intrinsicHeight / intrinsicWidth)
  const imageX = x - imageWidth * 0.04
  const imageY = y + height - imageHeight * 0.47

  context.save()
  context.beginPath()
  createRoundedRectPath(context, realX, realY, realWidth, realHeight, radius)
  context.clip()
  context.drawImage(image, imageX, imageY, imageWidth, imageHeight)
  context.restore()
}
function drawPanelBorder(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  theme: PosterTheme,
): void {
  context.save()
  context.shadowColor = 'rgba(0, 0, 0, 0)'
  context.shadowBlur = 0
  context.strokeStyle = theme.panelStroke
  context.lineWidth = theme.panelBorderWidth
  context.beginPath()
  createRoundedRectPath(
    context,
    x + theme.panelBorderWidth / 2,
    y + theme.panelBorderWidth / 2,
    width - theme.panelBorderWidth,
    height - theme.panelBorderWidth,
    radius - theme.panelBorderWidth / 2,
  )
  context.stroke()
  context.restore()
}
function drawPanelOuterShadow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string,
  blur: number,
  offsetY: number,
): void {
  if (blur === 0) return

  const padding = blur * 3 + Math.abs(offsetY)
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = Math.ceil((width + padding * 2) * POSTER_SCALE)
  shadowCanvas.height = Math.ceil((height + padding * 2) * POSTER_SCALE)

  const shadowContext = shadowCanvas.getContext('2d')
  if (!shadowContext) return

  shadowContext.scale(POSTER_SCALE, POSTER_SCALE)
  shadowContext.shadowColor = color
  shadowContext.shadowBlur = blur
  shadowContext.shadowOffsetY = offsetY
  shadowContext.fillStyle = '#000000'
  fillRoundedRect(shadowContext, padding, padding, width, height, radius)

  shadowContext.globalCompositeOperation = 'destination-out'
  shadowContext.shadowColor = 'rgba(0, 0, 0, 0)'
  shadowContext.shadowBlur = 0
  shadowContext.shadowOffsetY = 0
  shadowContext.fillStyle = '#000000'
  fillRoundedRect(shadowContext, padding, padding, width, height, radius)

  context.drawImage(
    shadowCanvas,
    x - padding,
    y - padding,
    width + padding * 2,
    height + padding * 2,
  )
}

function drawPanelInsetShadow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  theme: PosterTheme,
): void {
  if (theme.panelInsetShadowBlur === 0) return

  context.save()
  context.beginPath()
  createRoundedRectPath(context, x, y, width, height, radius)
  context.clip()

  const insetShadowBlur = theme.panelInsetShadowBlur * 5
  const insetShadowOffsetY = theme.panelInsetShadowOffsetY * 3
  const insetHighlightHeight = Math.max(18, theme.panelInsetShadowBlur * 2.75)

  context.shadowColor = theme.panelInsetShadowColor
  context.shadowBlur = insetShadowBlur
  context.shadowOffsetY = insetShadowOffsetY
  context.fillStyle = theme.panelInsetShadowColor
  context.fillRect(
    x,
    y - insetShadowOffsetY - insetHighlightHeight,
    width,
    insetHighlightHeight,
  )
  context.restore()
}

function drawPanelInsetEdgeShadows(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const topLeftColor = 'rgba(255, 255, 255, 0.2)'
  const bottomRightColor = 'rgba(255, 255, 255, 0.125)'
  const edgeSize = 6

  context.save()
  context.beginPath()
  createRoundedRectPath(context, x, y, width, height, radius)
  context.clip()
  context.filter = 'blur(1px)'

  const topGradient = context.createLinearGradient(0, y, 0, y + edgeSize)
  topGradient.addColorStop(0, topLeftColor)
  topGradient.addColorStop(0.34, 'rgba(255, 255, 255, 0.08)')
  topGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = topGradient
  context.fillRect(x, y, width, edgeSize)

  const leftGradient = context.createLinearGradient(x, 0, x + edgeSize, 0)
  leftGradient.addColorStop(0, topLeftColor)
  leftGradient.addColorStop(0.34, 'rgba(255, 255, 255, 0.08)')
  leftGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = leftGradient
  context.fillRect(x, y, edgeSize, height)

  const bottomGradient = context.createLinearGradient(
    0,
    y + height - edgeSize,
    0,
    y + height,
  )
  bottomGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  bottomGradient.addColorStop(0.66, 'rgba(255, 255, 255, 0.05)')
  bottomGradient.addColorStop(1, bottomRightColor)
  context.fillStyle = bottomGradient
  context.fillRect(x, y + height - edgeSize, width, edgeSize)

  const rightGradient = context.createLinearGradient(
    x + width - edgeSize,
    0,
    x + width,
    0,
  )
  rightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  rightGradient.addColorStop(0.66, 'rgba(255, 255, 255, 0.05)')
  rightGradient.addColorStop(1, bottomRightColor)
  context.fillStyle = rightGradient
  context.fillRect(x + width - edgeSize, y, edgeSize, height)

  context.restore()
}

function drawTokenBadge(
  context: CanvasRenderingContext2D,
  symbol: string,
  tokenIcon: HTMLImageElement | undefined,
  x: number,
  y: number,
  theme: PosterTheme,
): number {
  const height = 45
  const iconSize = 29
  const label = symbol.length > 10 ? `${symbol.slice(0, 10)}...` : symbol

  context.save()
  context.font = '700 20px Inter, sans-serif'
  const width = 15 + iconSize + 10 + context.measureText(label).width + 17
  drawTokenBadgeRect(context, x, y, width, height, height / 2, theme)

  if (tokenIcon) {
    context.save()
    context.beginPath()
    context.arc(
      x + 15 + iconSize / 2,
      y + height / 2,
      iconSize / 2,
      0,
      Math.PI * 2,
    )
    context.closePath()
    context.clip()
    context.drawImage(
      tokenIcon,
      x + 15,
      y + (height - iconSize) / 2,
      iconSize,
      iconSize,
    )
    context.restore()
  } else {
    const iconGradient = context.createLinearGradient(
      x + 15,
      y,
      x + 44,
      y + height,
    )
    iconGradient.addColorStop(0, '#FFB84D')
    iconGradient.addColorStop(1, '#F7931A')
    context.fillStyle = iconGradient
    context.beginPath()
    context.arc(
      x + 15 + iconSize / 2,
      y + height / 2,
      iconSize / 2,
      0,
      Math.PI * 2,
    )
    context.fill()
  }

  context.fillStyle = '#FFFFFF'
  context.textBaseline = 'middle'
  context.fillText(label, x + 15 + iconSize + 10, y + height / 2 + 1)
  context.restore()

  return width
}

function drawTokenBadgeRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  theme: PosterTheme,
): void {
  drawPanelOuterShadow(
    context,
    x,
    y,
    width,
    height,
    radius,
    theme.panelDropShadowColor,
    theme.panelDropShadowBlur,
    theme.panelDropShadowOffsetY,
  )
  drawPanelOuterShadow(
    context,
    x,
    y,
    width,
    height,
    radius,
    theme.panelGlowColor,
    theme.panelGlowBlur,
    0,
  )

  const backgroundGradient = context.createLinearGradient(0, y, 0, y + height)
  backgroundGradient.addColorStop(0, 'rgba(237, 241, 243, 0.05)')
  backgroundGradient.addColorStop(1, 'rgba(237, 241, 243, 0.015)')

  context.save()
  context.fillStyle = backgroundGradient
  fillRoundedRect(context, x, y, width, height, radius)
  context.restore()

  drawPanelInsetShadow(context, x, y, width, height, radius, theme)
  drawPanelInsetEdgeShadows(context, x, y, width, height, radius)
  drawPanelBorder(context, x, y, width, height, radius, theme)
}

function drawLeverageBadge(
  context: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  theme: PosterTheme,
): number {
  const height = 45
  const paddingX = 18

  context.save()
  context.font = '700 20px Inter, sans-serif'
  const width = context.measureText(label).width + paddingX * 2
  drawLeverageBadgeRect(context, x, y, width, height, height / 2, theme)
  drawLeverageBadgeText(context, label, x + paddingX, y, height, theme)
  context.restore()

  return width
}

function drawLeverageBadgeRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  theme: PosterTheme,
): void {
  const panelGradient = context.createLinearGradient(0, y + height, 0, y)

  panelGradient.addColorStop(0, theme.panelStart)
  panelGradient.addColorStop(1, theme.panelEnd)

  drawPanelOuterShadow(
    context,
    x,
    y,
    width,
    height,
    radius,
    theme.panelDropShadowColor,
    theme.panelDropShadowBlur,
    theme.panelDropShadowOffsetY,
  )
  drawPanelOuterShadow(
    context,
    x,
    y,
    width,
    height,
    radius,
    theme.panelGlowColor,
    theme.panelGlowBlur,
    0,
  )

  context.fillStyle = panelGradient
  fillRoundedRect(context, x, y, width, height, radius)

  drawPanelInsetShadow(context, x, y, width, height, radius, theme)
  drawPanelInsetEdgeShadows(context, x, y, width, height, radius)
  drawPanelBorder(context, x, y, width, height, radius, theme)
}

function drawLeverageBadgeText(
  context: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  badgeHeight: number,
  theme: PosterTheme,
): void {
  context.save()

  const fontSize = 20
  const font = `700 ${fontSize}px Inter, sans-serif`
  const textHeight = fontSize * 1.15
  const padding = 12

  context.font = font
  const textWidth = context.measureText(label).width

  const textCanvas = document.createElement('canvas')
  textCanvas.width = Math.ceil((textWidth + padding * 2) * POSTER_SCALE)
  textCanvas.height = Math.ceil((textHeight + padding * 2) * POSTER_SCALE)

  const textContext = textCanvas.getContext('2d')
  if (!textContext) {
    context.restore()
    return
  }

  textContext.scale(POSTER_SCALE, POSTER_SCALE)
  textContext.font = font
  textContext.textBaseline = 'top'

  const textX = padding
  const textY = padding
  const textGradient = textContext.createLinearGradient(
    0,
    textY,
    0,
    textY + textHeight,
  )

  textGradient.addColorStop(0.25, theme.percentGradientStart)
  textGradient.addColorStop(1, theme.percentGradientEnd)

  textContext.shadowColor = '#00000014'
  textContext.shadowBlur = 12.14
  textContext.shadowOffsetY = 3.03
  textContext.fillStyle = textGradient
  textContext.fillText(label, textX, textY)

  drawTextInsetShadow(
    textContext,
    label,
    font,
    textX,
    textY,
    textCanvas.width / POSTER_SCALE,
    textCanvas.height / POSTER_SCALE,
    '#FFFFFFB3',
    0.76,
    0.76,
  )
  drawTextInsetShadow(
    textContext,
    label,
    font,
    textX,
    textY,
    textCanvas.width / POSTER_SCALE,
    textCanvas.height / POSTER_SCALE,
    '#FFFFFFA0',
    2.87,
    2.87,
  )

  context.drawImage(
    textCanvas,
    x - padding,
    y + (badgeHeight - textHeight) / 2 + 1 - padding,
    textWidth + padding * 2,
    textHeight + padding * 2,
  )
  context.restore()
}

function drawPosterPercent(
  context: CanvasRenderingContext2D,
  largeValue: string,
  x: number,
  y: number,
  maxWidth: number,
  theme: PosterTheme,
): void {
  context.save()
  let fontSize = 145
  context.font = `800 ${fontSize}px "Lufga", Inter, sans-serif`
  while (context.measureText(largeValue).width > maxWidth && fontSize > 86) {
    fontSize -= 4
    context.font = `800 ${fontSize}px "Lufga", Inter, sans-serif`
  }

  const font = context.font
  const textWidth = context.measureText(largeValue).width
  const textHeight = fontSize * 1.12
  const padding = 36
  const textCanvas = document.createElement('canvas')

  textCanvas.width = Math.ceil((textWidth + padding * 2) * POSTER_SCALE)
  textCanvas.height = Math.ceil((textHeight + padding * 2) * POSTER_SCALE)

  const textContext = textCanvas.getContext('2d')
  if (!textContext) {
    context.restore()
    return
  }

  textContext.scale(POSTER_SCALE, POSTER_SCALE)
  textContext.font = font
  textContext.textBaseline = 'top'

  const textX = padding
  const textY = padding
  const percentGradient = textContext.createLinearGradient(
    0,
    textY,
    0,
    textY + textHeight,
  )

  percentGradient.addColorStop(0.25, theme.percentGradientStart)
  percentGradient.addColorStop(1, theme.percentGradientEnd)

  textContext.shadowColor = '#00000014'
  textContext.shadowBlur = 12.14
  textContext.shadowOffsetY = 3.03
  textContext.fillStyle = percentGradient
  textContext.fillText(largeValue, textX, textY)

  drawTextInsetShadow(
    textContext,
    largeValue,
    font,
    textX,
    textY,
    textCanvas.width / POSTER_SCALE,
    textCanvas.height / POSTER_SCALE,
    '#FFFFFFB3',
    0.76,
    0.76,
  )
  drawTextInsetShadow(
    textContext,
    largeValue,
    font,
    textX,
    textY,
    textCanvas.width / POSTER_SCALE,
    textCanvas.height / POSTER_SCALE,
    '#FFFFFFA0',
    2.87,
    2.87,
  )

  context.drawImage(
    textCanvas,
    x - padding,
    y - padding,
    textWidth + padding * 2,
    textHeight + padding * 2,
  )
  context.restore()
}

function drawTextInsetShadow(
  context: CanvasRenderingContext2D,
  text: string,
  font: string,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  blur: number,
  offsetY: number,
): void {
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = Math.ceil(width * POSTER_SCALE)
  shadowCanvas.height = Math.ceil(height * POSTER_SCALE)

  const shadowContext = shadowCanvas.getContext('2d')
  if (!shadowContext) return

  shadowContext.scale(POSTER_SCALE, POSTER_SCALE)
  shadowContext.font = font
  shadowContext.textBaseline = 'top'
  shadowContext.shadowColor = color
  shadowContext.shadowBlur = blur
  shadowContext.shadowOffsetY = offsetY
  shadowContext.fillStyle = color
  shadowContext.fillText(text, x, y)

  shadowContext.globalCompositeOperation = 'destination-out'
  shadowContext.shadowColor = 'rgba(0, 0, 0, 0)'
  shadowContext.shadowBlur = 0
  shadowContext.shadowOffsetY = 0
  shadowContext.fillStyle = '#000000'
  shadowContext.fillText(text, x, y)

  context.save()
  context.globalCompositeOperation = 'source-atop'
  context.drawImage(shadowCanvas, 0, 0, width, height)
  context.restore()
}

function drawPositivePosterArt(
  context: CanvasRenderingContext2D,
  artImages: PosterArtImages,
): void {
  context.save()

  drawPosterImage(context, artImages.chopsticks, -145, 225, 433, 370, {
    alpha: 1,
    overlayBlur: 1,
    overlayColor: '#52FA8D',
    rotation: -0.08,
    shadowBlur: 24,
    shadowColor: 'rgba(42, 243, 138, 0.18)',
    overlayOpacity: 1,
  })
  drawPosterImage(context, artImages.bamboo, 440, -85, 680, 878, {
    overlayBlur: 14,
    overlayColor: '#52FA8D',
    shadowBlur: 5,
    shadowColor: 'rgba(58, 245, 140, 0.2)',
    overlayOpacity: 1,
  })

  context.restore()
}

function drawNegativePosterArt(
  context: CanvasRenderingContext2D,
  artImages: PosterArtImages,
): void {
  context.save()

  drawPosterImage(context, artImages.chopsticks, -145, 225, 433, 370, {
    alpha: 1,
    overlayBlur: 1,
    overlayColor: '#FB7185',
    rotation: -0.08,
    shadowBlur: 24,
    shadowColor: 'rgba(255, 111, 136, 0.18)',
    overlayOpacity: 1,
  })
  drawPosterImage(context, artImages.sake, 355, -190, 812, 966, {
    overlayBlur: 14,
    overlayColor: '#FB7185',
    shadowBlur: 46,
    shadowColor: 'rgba(255, 111, 136, 0.23)',
    overlayOpacity: 1,
  })

  context.restore()
}

type PosterImageOptions = {
  alpha?: number
  overlayBlur?: number
  overlayColor?: string
  overlayOpacity?: number
  rotation?: number
  shadowBlur?: number
  shadowColor?: string
}

function drawPosterImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  options: PosterImageOptions = {},
): void {
  context.save()
  context.globalAlpha = options.alpha ?? 1
  context.shadowColor = options.shadowColor ?? 'rgba(0, 0, 0, 0)'
  context.shadowBlur = options.shadowBlur ?? 0
  context.translate(x + width / 2, y + height / 2)
  context.rotate(options.rotation ?? 0)
  context.drawImage(image, -width / 2, -height / 2, width, height)

  if (options.overlayColor) {
    drawBlurredImageOverlay(
      context,
      image,
      -width / 2,
      -height / 2,
      width,
      height,
      options.overlayColor,
      options.overlayOpacity ?? 0.25,
      options.overlayBlur ?? 5,
    )
  }

  context.restore()
}

function drawBlurredImageOverlay(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  opacity: number,
  blur: number,
): void {
  const padding = blur * 3
  const overlayCanvas = document.createElement('canvas')
  overlayCanvas.width = Math.ceil((width + padding * 2) * POSTER_SCALE)
  overlayCanvas.height = Math.ceil((height + padding * 2) * POSTER_SCALE)

  const overlayContext = overlayCanvas.getContext('2d')
  if (!overlayContext) return

  overlayContext.scale(POSTER_SCALE, POSTER_SCALE)
  overlayContext.drawImage(image, padding, padding, width, height)
  overlayContext.globalCompositeOperation = 'source-in'
  overlayContext.globalAlpha = opacity
  overlayContext.fillStyle = color
  overlayContext.fillRect(padding, padding, width, height)

  context.save()
  context.globalAlpha = 1
  context.globalCompositeOperation = 'darken'
  context.shadowBlur = 0
  context.shadowColor = 'rgba(0, 0, 0, 0)'
  context.filter = `blur(${blur}px)`
  context.drawImage(
    overlayCanvas,
    x - padding,
    y - padding,
    width + padding * 2,
    height + padding * 2,
  )
  context.restore()
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle?: string,
  lineWidth = 1,
): void {
  context.beginPath()
  createRoundedRectPath(context, x, y, width, height, radius)
  context.fill()
  if (strokeStyle) {
    context.strokeStyle = strokeStyle
    context.lineWidth = lineWidth
    context.stroke()
  }
}

function createRoundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const clampedRadius = Math.min(radius, width / 2, height / 2)
  context.moveTo(x + clampedRadius, y)
  context.arcTo(x + width, y, x + width, y + height, clampedRadius)
  context.arcTo(x + width, y + height, x, y + height, clampedRadius)
  context.arcTo(x, y + height, x, y, clampedRadius)
  context.arcTo(x, y, x + width, y, clampedRadius)
  context.closePath()
}
