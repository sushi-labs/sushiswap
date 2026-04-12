'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/outline'
import { useLocalStorage } from '@sushiswap/hooks'
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
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type TradeHistoryItemType, perpsNumberFormatter } from 'src/lib/perps'
import { useUserPositions } from 'src/lib/perps/user/use-user-positions'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { TableButton } from '../../_common'

function useLeverageMultiplier(
  trade: TradeHistoryItemType,
): number | undefined {
  const { data: positions } = useUserPositions()
  const {
    state: { assetListQuery },
  } = useAssetListState()
  const [lastUsedLeverages] = useLocalStorage<Record<string, number>>(
    'hyperliquid.last_used_leverage',
    {},
  )
  const asset = assetListQuery.data?.get(trade.coin)

  const leverage = useMemo(() => {
    if (positions) {
      const position = positions.find(
        (p) =>
          p.position.coin === trade.coin &&
          (trade.perpsDex == null || p.perpsDex === trade.perpsDex),
      )
      if (position?.position.leverage?.value != null) {
        return position.position.leverage.value
      }
    }

    const stored = lastUsedLeverages[trade.coin]
    return stored ?? asset?.maxLeverage
  }, [trade.coin, trade.perpsDex, positions, asset, lastUsedLeverages])

  return leverage
}

const REFERRAL_CODE: string | undefined = undefined
const SHARE_URL = 'https://www.sushi.com/perps'

type ShareClosedPnlDialogProps = {
  trade: TradeHistoryItemType
}

export function ShareClosedPnlDialog({
  trade,
}: ShareClosedPnlDialogProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSavingImage, setIsSavingImage] = useState(false)
  const [isSharingImage, setIsSharingImage] = useState(false)
  const posterRef = useRef<HTMLCanvasElement | null>(null)

  const totalPnl = useMemo(() => {
    return Number.parseFloat(trade.closedPnl) - Number.parseFloat(trade.fee)
  }, [trade.closedPnl, trade.fee])

  const shareText = useMemo(() => getDefaultShareText(trade), [trade])

  useEffect(() => {
    if (!open) {
      setCopied(false)
    }
  }, [open])

  async function handleCopyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(SHARE_URL)
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
      downloadBlob(blob, getShareImageFileName(trade))
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
      const file = new File([blob], getShareImageFileName(trade), {
        type: 'image/png',
      })

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          text: shareText,
          title: 'Share closed trade',
          url: SHARE_URL,
        })
        return
      }

      const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SHARE_URL)}`
      window.open(url, '_blank', 'noopener,noreferrer')
      createErrorToast(
        'This browser cannot attach images directly to X. Opened the X composer with text and link instead.',
        false,
      )
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent
        variant="perps-default"
        className="!inline-grid !w-auto md:!w-auto !min-w-0 !max-h-[calc(100dvh-16px)] !max-w-[calc(100vw-16px)] overflow-y-auto p-4 md:p-5"
      >
        <DialogTitle className="sr-only">Share Closed Trade</DialogTitle>

        <div className="mx-auto w-fit max-w-full space-y-8">
          <div className="flex justify-center">
            <SharePoster
              posterRef={posterRef}
              trade={trade}
              totalPnl={totalPnl}
            />
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="default"
              className="!rounded-2xl"
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
              variant="default"
              className="!rounded-2xl"
              icon={LinkIcon}
              onClick={() => {
                void handleCopyLink()
              }}
            >
              {copied ? 'Copied Link' : 'Copy Link'}
            </Button>
            <Button
              type="button"
              variant="default"
              className="!rounded-2xl sm:col-span-2"
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
  trade: TradeHistoryItemType
  totalPnl: number
}

function SharePoster({
  posterRef,
  trade,
  totalPnl,
}: SharePosterProps): JSX.Element {
  const symbol = getTradeSymbol(trade)
  const leverageMultiplier = useLeverageMultiplier(trade)
  const direction = trade.side === 'A' ? 'SHORT' : 'LONG'
  const closeAction = trade.side === 'A' ? 'BUY' : 'SELL'
  const closePrice = Number.parseFloat(trade.px)
  const size = Number.parseFloat(trade.sz)
  const realizedPnl = Number.parseFloat(trade.closedPnl)
  const floatSide = trade.side === 'B' ? 1 : -1
  const entryPrice =
    size === 0 ? closePrice : closePrice + (floatSide * realizedPnl) / size
  const entryNotional = entryPrice * size
  const pnlPercent =
    entryNotional === 0
      ? 0
      : (totalPnl / entryNotional) * (leverageMultiplier ?? 1) * 100
  const isPositive = pnlPercent >= 0
  const largeValue = `${isPositive ? '+' : ''}${perpsNumberFormatter({
    value: pnlPercent,
    minFraxDigits: 1,
    maxFraxDigits: 1,
  })}%`
  const badgeText = leverageMultiplier
    ? `${direction} ${leverageMultiplier}X`
    : direction

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
        closeAction,
        isPositive,
        largeValue,
        symbol,
        sushiIcon,
      })
    }

    void renderPoster()

    return () => {
      cancelled = true
    }
  }, [badgeText, closeAction, isPositive, largeValue, posterRef, symbol])

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

function getDefaultShareText(trade: TradeHistoryItemType): string {
  const baseText = `Trade $${getTradeSymbol(trade)} perps on @SushiSwap`

  return REFERRAL_CODE
    ? `${baseText} using my referral code ${REFERRAL_CODE}`
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

function getShareImageFileName(trade: TradeHistoryItemType): string {
  return `sushi-perps-${getTradeSymbol(trade).toLowerCase()}-${trade.time}.png`
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
  closeAction: string
  isPositive: boolean
  largeValue: string
  symbol: string
  sushiIcon: HTMLImageElement
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
  backgroundGradient.addColorStop(0.17, 'rgba(52, 211, 153, 0.2)')
  backgroundGradient.addColorStop(0.76, 'rgba(30, 30, 30, 0.2)')
  backgroundGradient.addColorStop(1, 'rgba(16, 23, 40, 0.2)')
  context.fillStyle = backgroundGradient
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT)

  drawPosterBadge(context, data.badgeText)
  drawPosterGlowSquares(context, data.isPositive)
  drawPosterHeader(context, data.symbol, data.closeAction)
  drawPosterPercent(context, data.largeValue, data.isPositive)
  drawPosterLink(context)
  drawPosterBrand(context, data.sushiIcon)

  context.restore()
}

function drawPosterBadge(
  context: CanvasRenderingContext2D,
  badgeText: string,
): void {
  context.save()
  const badgeX = 132.025
  const badgeY = 593.555
  const badgeHeight = 51.509
  const horizontalPadding = 12

  context.font = '500 32.778px "Lufga", Inter, sans-serif'
  const badgeWidth =
    context.measureText(badgeText).width + horizontalPadding * 2

  context.fillStyle = '#F87171'
  fillRoundedRect(context, badgeX, badgeY, badgeWidth, badgeHeight, 9.365)
  context.fillStyle = '#F5D2D9'
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

  for (const square of squares) {
    drawGlowSquare(
      context,
      glowOriginX + square.left,
      glowOriginY + square.top,
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
  closeAction: string,
): void {
  context.save()
  context.fillStyle = '#FFFFFF'
  context.textBaseline = 'alphabetic'
  context.font = '700 62px Inter, sans-serif'
  context.fillText(symbol, 697.893, 640)
  const symbolWidth = context.measureText(symbol).width
  context.fillText('|', 697.893 + symbolWidth + 20, 640)
  context.fillText(closeAction, 697.893 + symbolWidth + 58, 640)
  context.restore()
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

function drawPosterLink(context: CanvasRenderingContext2D): void {
  context.save()
  context.textBaseline = 'top'
  context.fillStyle = '#97A3B7'
  context.font = '400 37px Inter, sans-serif'
  context.fillText(
    REFERRAL_CODE ? 'Referral code:' : 'Trade on:',
    88.893,
    977.555,
  )
  context.fillStyle = '#FFFFFF'
  context.fillText(REFERRAL_CODE ?? SHARE_URL, 88.893, 1030.555)
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
): void {
  context.beginPath()
  createRoundedRectPath(context, x, y, width, height, radius)
  context.fill()
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

function getTradeSymbol(trade: TradeHistoryItemType): string {
  return (
    trade.symbol?.split('-')?.[0] ||
    trade.token0Symbol ||
    trade.cleanedCoin ||
    trade.coin
  )
}
