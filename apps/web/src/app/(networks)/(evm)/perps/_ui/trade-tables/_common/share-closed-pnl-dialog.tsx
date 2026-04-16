'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/outline'
import { createErrorToast } from '@sushiswap/notifications'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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
    const size = Number.parseFloat(trade.position.szi)
    const entryNotional = entryPrice * size
    const leverage = trade.position.leverage.value
    const pnl = Number.parseFloat(trade.position.unrealizedPnl ?? '0')
    const roePc = (pnl / entryNotional) * (leverage ?? 1) * 100
    return {
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
    return {
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
    const price =
      Number.parseFloat(trade.usdcValue) / Number.parseFloat(trade.totalBalance)
    return {
      symbol: trade.coin,
      coin: trade.assetName || '',
      time: Date.now(),
      closedPnl: trade?.pnlRoePc?.pnl ?? 0,
      side: 'B', //can hardcode B here, only spot balances shown here so this has no effect
      sz: trade.totalBalance,
      px: price.toString(),
      roePc: trade?.pnlRoePc?.roePc ?? 0,
    }
  }

  // TradeHistoryItemType — full data
  if ('token0Symbol' in trade) {
    const closedPnl = Number.parseFloat(trade.closedPnl)
    const fees = Number.parseFloat(trade.fee)
    const totalPnl = closedPnl - fees
    return {
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
      createErrorToast('Failed to copy the current page URL.', false)
    }
  }

  async function handleSaveImage(): Promise<void> {
    const posterNode = posterRef.current

    if (!posterNode) {
      createErrorToast('Unable to find the share image to export.', false)
      return
    }

    setIsSavingImage(true)
    try {
      const blob = await exportPosterBlob(posterNode)
      downloadBlob(blob, getShareImageFileName(normalizedTrade))
    } catch {
      createErrorToast('Failed to export the share image.', false)
    } finally {
      setIsSavingImage(false)
    }
  }

  async function handleShareOnX(): Promise<void> {
    const posterNode = posterRef.current
    if (!posterNode) {
      createErrorToast('Unable to find the share image to export.', false)
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

      createErrorToast('Failed to prepare the share image.', false)
    } finally {
      setIsSharingImage(false)
    }
  }

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent
        variant="perps-default"
        className="!inline-grid !w-auto md:!w-auto !min-w-0 !max-h-[calc(100dvh-16px)] !max-w-[calc(100vw-16px)] overflow-y-auto p-4 md:p-5"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Share Closed Trade</DialogTitle>

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

          <div className="grid w-full gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="perps-default"
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
              variant="perps-default"
              icon={LinkIcon}
              onClick={() => {
                void handleCopyLink()
              }}
            >
              {copied ? 'Copied Link' : 'Copy Link'}
            </Button>
            <Button
              type="button"
              variant="perps-default"
              className="sm:col-span-2"
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
      </DialogContent>
    </Dialog>
  )
}

const POSTER_WIDTH = 1080
const POSTER_HEIGHT = 1450
const POSTER_ASPECT_RATIO = POSTER_WIDTH / POSTER_HEIGHT

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
  const symbol = trade.symbol
  const leverageMultiplier = leverage
  const direction = trade.side === 'A' ? 'SHORT' : 'LONG'
  const closePrice = Number.parseFloat(trade.px)
  const size = Number.parseFloat(trade.sz)
  const realizedPnl = trade.closedPnl
  const floatSide = trade.side === 'B' ? 1 : -1
  const entryPrice =
    size === 0 ? closePrice : closePrice + (floatSide * realizedPnl) / size
  const entryNotional = entryPrice * size
  const pnlPercent =
    'roePc' in trade
      ? Number(trade.roePc)
      : entryNotional === 0
        ? 0
        : (totalPnl / entryNotional) * (leverageMultiplier ?? 1) * 100
  const isPositive = pnlPercent >= 0
  const largeValue = `${isPositive ? '+' : ''}${perpsNumberFormatter({
    value: pnlPercent,
    minFraxDigits: 1,
    maxFraxDigits: 1,
  })}%`
  const badgeText = leverageMultiplier
    ? `${direction} ${leverageMultiplier}x`
    : 'SPOT'

  useEffect(() => {
    let cancelled = false

    async function renderPoster(): Promise<void> {
      const canvas = posterRef.current
      if (!canvas) return

      if ('fonts' in document) {
        await document.fonts.ready
      }

      const sushiIcon = await getSushiIconImage()
      if (cancelled) return

      const context = canvas.getContext('2d')
      if (!context) return

      drawPosterCanvas(context, {
        badgeText,
        isPositive,
        isLong: direction === 'LONG' || badgeText === 'SPOT',
        largeValue,
        symbol,
        sushiIcon,
        referralCode,
        imageUrl,
      })
    }

    void renderPoster()

    return () => {
      cancelled = true
    }
  }, [
    badgeText,
    isPositive,
    largeValue,
    posterRef,
    symbol,
    referralCode,
    direction,
    imageUrl,
  ])

  return (
    <div
      className="w-full select-none"
      style={{
        width: `min(500px, calc(100vw - 48px), calc((100dvh - 240px) * ${POSTER_ASPECT_RATIO}))`,
      }}
    >
      <canvas
        ref={posterRef}
        width={POSTER_WIDTH}
        height={POSTER_HEIGHT}
        className="block h-auto w-full rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
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

type PosterCanvasData = {
  badgeText: string
  isPositive: boolean
  largeValue: string
  symbol: string
  sushiIcon: HTMLImageElement
  referralCode?: string
  isLong: boolean
  imageUrl: string
}

function drawPosterCanvas(
  context: CanvasRenderingContext2D,
  data: PosterCanvasData,
): void {
  context.clearRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)
  context.save()

  context.beginPath()
  createRoundedRectPath(context, 0, 0, POSTER_WIDTH, POSTER_HEIGHT, 20)
  context.clip()

  context.fillStyle = '#101728'
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)

  const backgroundGradient = context.createLinearGradient(
    0,
    0,
    POSTER_WIDTH,
    POSTER_HEIGHT,
  )
  backgroundGradient.addColorStop(
    0.17,
    data.isPositive ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 113, 133, 0.2)',
  )
  backgroundGradient.addColorStop(
    0.76,
    data.isPositive ? 'rgba(30, 30, 30, 0.2)' : 'rgba(30, 20, 22, 0.2)',
  )
  backgroundGradient.addColorStop(
    1,
    data.isPositive ? 'rgba(16, 23, 40, 0.2)' : 'rgba(40, 16, 20, 0.2)',
  )
  context.fillStyle = backgroundGradient
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)

  drawPosterBadge(context, data.badgeText, data.isLong)
  drawPosterGlowSquares(context, data.isPositive)
  drawPosterHeader(context, data.symbol, data.imageUrl)
  drawPosterPercent(context, data.largeValue, data.isPositive)
  drawPosterLink(context, data.referralCode)
  drawPosterBrand(context, data.sushiIcon)

  context.restore()
}

function drawPosterBadge(
  context: CanvasRenderingContext2D,
  badgeText: string,
  isLong: boolean,
): void {
  context.save()
  const badgeX = 132.025
  const badgeY = 593.555
  const badgeHeight = 51.509
  const horizontalPadding = 12

  context.font = '700 32.778px "Lufga", Inter, sans-serif'
  const badgeWidth =
    context.measureText(badgeText).width + horizontalPadding * 2

  context.fillStyle = isLong
    ? 'rgba(52, 211, 153, 0.6)'
    : 'rgba(251, 113, 133, 0.6)'
  fillRoundedRect(
    context,
    badgeX,
    badgeY,
    badgeWidth,
    badgeHeight,
    9.365,
    isLong ? '#34D399' : '#FB7185',
    2,
  )
  context.fillStyle = 'white'
  context.textBaseline = 'middle'

  context.fillText(
    badgeText,
    badgeX + horizontalPadding,
    badgeY + badgeHeight / 2 + 4,
  )
  context.restore()
}

function drawPosterGlowSquares(
  context: CanvasRenderingContext2D,
  isPositive: boolean,
): void {
  const baseColor = isPositive ? '#34D399' : '#FB7185'
  const glowOriginX = 717.893
  const glowOriginY = 331.555
  const squareSize = 72.667
  const squares: ReadonlyArray<{ left: number; top: number; alpha: number }> = [
    { left: 109, top: 0, alpha: 1 },
    { left: 48.444, top: squareSize, alpha: 1 },
    { left: 0, top: squareSize * 2, alpha: 0.1 },
    { left: 218, top: squareSize * 2, alpha: 1 },
    { left: 169.556, top: squareSize, alpha: 0.4 },
  ]

  const maxTop = squareSize * 2

  for (const square of squares) {
    const top = isPositive ? square.top : maxTop - square.top
    drawGlowSquare(
      context,
      glowOriginX + square.left - 10,
      glowOriginY + top,
      baseColor,
      square.alpha,
    )
  }
}

function drawGlowSquare(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  alpha: number,
): void {
  context.save()
  context.globalAlpha = alpha
  context.shadowColor = color
  context.shadowBlur = 80
  context.fillStyle = color
  fillRoundedRect(context, x, y, 72.667, 72.667, 24)
  context.restore()
}
function drawPosterHeader(
  context: CanvasRenderingContext2D,
  symbol: string,
  imageUrl: string,
): void {
  const middleSquareCenterX = 717.893 + 109 - 10 + 72.667 / 2
  const y = 640
  const imageSize = 62
  const gap = 16

  const drawText = (includeImage: boolean, img?: HTMLImageElement) => {
    context.save()
    context.fillStyle = '#FFFFFF'
    context.textBaseline = 'alphabetic'
    context.font = '700 62px Inter, sans-serif'

    const symbolWidth = context.measureText(symbol).width

    if (includeImage && img) {
      const totalWidth = imageSize + gap + symbolWidth
      const startX = middleSquareCenterX - totalWidth / 2
      const imgX = startX
      const imgY = y - imageSize + 8

      // Draw circular clipped image
      context.save()
      context.beginPath()
      context.arc(
        imgX + imageSize / 2,
        imgY + imageSize / 2,
        imageSize / 2,
        0,
        Math.PI * 2,
      )
      context.closePath()
      context.clip()
      context.drawImage(img, imgX, imgY, imageSize, imageSize)
      context.restore()

      context.fillText(symbol, startX + imageSize + gap, y)
    } else {
      context.fillText(symbol, middleSquareCenterX - symbolWidth / 2, y)
    }

    context.restore()
  }

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => drawText(true, img)
  img.onerror = () => drawText(false)
  img.src = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}` //need to proxy the image. we need to use anonymous cross-origin requests to avoid tainting the canvas
}

function drawPosterPercent(
  context: CanvasRenderingContext2D,
  largeValue: string,
  isPositive: boolean,
): void {
  context.save()
  context.fillStyle = isPositive ? '#34D399' : '#FB7185'
  context.font = '800 242px "Lufga", Inter, sans-serif'
  context.textBaseline = 'top'
  context.fillText(largeValue, 108.893, 680)
  context.restore()
}

function drawPosterLink(
  context: CanvasRenderingContext2D,
  referralCode?: string,
): void {
  context.save()
  context.textBaseline = 'top'
  context.fillStyle = '#97A3B7'
  context.font = '400 37px Inter, sans-serif'
  context.fillText(
    referralCode ? 'Referral code:' : 'Trade on:',
    referralCode ? 88 : 86,
    977.555,
  )
  context.fillStyle = '#FFFFFF'
  context.fillText(referralCode ?? SHARE_URL, 88.893, 1030.555)
  context.restore()
}

function drawPosterBrand(
  context: CanvasRenderingContext2D,
  sushiIcon: HTMLImageElement,
): void {
  context.save()
  context.drawImage(sushiIcon, 88.893, 1258, 76, 64)
  context.fillStyle = '#FFFFFF'
  context.font = '700 76px Inter, sans-serif'
  context.textBaseline = 'middle'
  context.fillText('Sushi', 182, 1298)
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
