const POSTER_WIDTH = 975
const POSTER_HEIGHT = 530
const POSTER_SCALE = 2
const POSTER_CANVAS_WIDTH = POSTER_WIDTH * POSTER_SCALE
const POSTER_CANVAS_HEIGHT = POSTER_HEIGHT * POSTER_SCALE

let sushiIconPromise: Promise<HTMLImageElement> | null = null
let posterArtImagesPromise: Promise<PosterArtImages> | null = null

export function getSushiIconImage(): Promise<HTMLImageElement> {
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

export function getPosterArtImages(): Promise<PosterArtImages> {
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

export function getOptionalPosterImage(
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

export type PosterArtImages = {
  bamboo: HTMLImageElement
  chopsticks: HTMLImageElement
  pnlCardHeader: HTMLImageElement
  pnlCardNegCorner: HTMLImageElement
  pnlCardPosCorner: HTMLImageElement
  sake: HTMLImageElement
}

export type PosterCanvasData = {
  artImages: PosterArtImages
  entryPriceLabel: string
  exitPriceLabel: string
  isPositive: boolean
  leverageLabel: string
  largeValue: string
  normalizedPnlPercent: number
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

const PNL_PANEL_BORDER_COLOR = '#EDF1F366'
const PNL_PANEL_BORDER_WIDTH = 0.5
const PNL_PANEL_DROP_SHADOW_BLUR = 38.86
const PNL_PANEL_DROP_SHADOW_COLOR = '#00000005'
const PNL_PANEL_DROP_SHADOW_OFFSET_Y = 12.95
const PNL_PANEL_INSET_SHADOW_BLUR = 6.48
const PNL_PANEL_INSET_SHADOW_COLOR = '#FFFFFF1F'
const PNL_PANEL_INSET_SHADOW_OFFSET_Y = 6.48
const PNL_PANEL_BASE_WIDTH = 445
const PNL_PANEL_WIDE_EXTRA_WIDTH = 55
const PNL_PANEL_WIDE_PNL_PERCENT_THRESHOLD = 999.99

type PosterVerticalShadow = {
  blur: number
  color: string
  offsetY: number
}

const TRADE_BADGE_OUTER_SHADOWS: readonly PosterVerticalShadow[] = [
  { blur: 6, color: '#00000033', offsetY: 4 },
  { blur: 3.22, color: '#0000000F', offsetY: 1.21 },
  { blur: 0.33, color: '#00000005', offsetY: 0.11 },
]
const TRADE_BADGE_INSET_SHADOWS: readonly PosterVerticalShadow[] = [
  { blur: 0.4, color: '#FFFFFF1F', offsetY: 0.2 },
  { blur: 0.05, color: '#FFFFFF12', offsetY: 0.05 },
]

export function drawPosterCanvas(
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
  drawPosterArtCornerOverlay(context)
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

function drawPosterArtCornerOverlay(context: CanvasRenderingContext2D): void {
  const diameter = POSTER_WIDTH * 0.6
  const radius = diameter / 2

  context.save()
  context.filter = 'blur(30px)'
  context.fillStyle = 'rgba(13, 18, 23, .2)'
  context.beginPath()
  context.arc(
    POSTER_WIDTH - radius / 1.5,
    POSTER_HEIGHT,
    radius,
    0,
    Math.PI * 2,
  )
  context.fill()
  context.restore()
}

function drawPosterHeader(
  context: CanvasRenderingContext2D,
  sushiIcon: HTMLImageElement,
): void {
  context.save()
  context.drawImage(sushiIcon, 42, 35, 40, 34)
  context.fillStyle = '#FFFFFF'
  context.font = '800 35px Inter, sans-serif'
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
  context.font = '600 18px Inter, sans-serif'
  context.fillText(label, x, y)
  context.fillStyle = '#FFFFFF'
  context.font = '600 20px Inter, sans-serif'
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
  const panelExtraWidth =
    Math.abs(data.normalizedPnlPercent) > PNL_PANEL_WIDE_PNL_PERCENT_THRESHOLD
      ? PNL_PANEL_WIDE_EXTRA_WIDTH
      : 0
  const width = PNL_PANEL_BASE_WIDTH + panelExtraWidth
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
    PNL_PANEL_DROP_SHADOW_COLOR,
    PNL_PANEL_DROP_SHADOW_BLUR,
    PNL_PANEL_DROP_SHADOW_OFFSET_Y,
  )
  drawPanelOuterShadow(
    context,
    x,
    y,
    width,
    height,
    radius,
    theme.panelGlowColor,
    12,
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
  drawPnlPanelInsetShadow(context, x, y, width, height, radius)
  drawPnlPanelLiquidGlassEdge(context, x, y, width, height, radius)
  drawPnlPanelBorder(context, x, y, width, height, radius)

  const tokenBadgeWidth = drawTokenBadge(
    context,
    data.symbol,
    data.tokenIcon,
    x + 44,
    y + 44,
  )
  drawLeverageBadge(
    context,
    data.leverageLabel,
    x + 44 + tokenBadgeWidth + 12,
    y + 44,
    theme,
  )

  drawPosterPercent(
    context,
    data.largeValue,
    x + 44,
    y + 126,
    358 + panelExtraWidth,
    theme,
  )
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

function drawPnlPanelInsetShadow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  context.save()
  context.beginPath()
  createRoundedRectPath(context, x, y, width, height, radius)
  context.clip()

  const insetHighlightHeight = 20
  context.shadowColor = PNL_PANEL_INSET_SHADOW_COLOR
  context.shadowBlur = PNL_PANEL_INSET_SHADOW_BLUR
  context.shadowOffsetY = PNL_PANEL_INSET_SHADOW_OFFSET_Y
  context.fillStyle = PNL_PANEL_INSET_SHADOW_COLOR
  context.fillRect(
    x,
    y - PNL_PANEL_INSET_SHADOW_OFFSET_Y - insetHighlightHeight,
    width,
    insetHighlightHeight,
  )
  context.restore()
}

function drawPnlPanelLiquidGlassEdge(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  edgeSize = 18,
): void {
  context.save()
  context.beginPath()
  createRoundedRectPath(context, x, y, width, height, radius)
  context.clip()
  context.filter = 'blur(2px)'

  const topGradient = context.createLinearGradient(0, y, 0, y + edgeSize)
  topGradient.addColorStop(0, 'rgba(255, 255, 255, 0.22)')
  topGradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.08)')
  topGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = topGradient
  fillRoundedRect(context, x, y, width, height, radius)

  const leftGradient = context.createLinearGradient(x, 0, x + edgeSize, 0)
  leftGradient.addColorStop(0, 'rgba(255, 255, 255, 0.13)')
  leftGradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.06)')
  leftGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = leftGradient
  fillRoundedRect(context, x, y, width, height, radius)

  const bottomGradient = context.createLinearGradient(
    0,
    y + height - edgeSize,
    0,
    y + height,
  )
  bottomGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  bottomGradient.addColorStop(1, 'rgba(0, 0, 0, 0.08)')
  context.fillStyle = bottomGradient
  fillRoundedRect(context, x, y, width, height, radius)

  const rightGradient = context.createLinearGradient(
    x + width - edgeSize,
    0,
    x + width,
    0,
  )
  rightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  rightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.06)')
  context.fillStyle = rightGradient
  fillRoundedRect(context, x, y, width, height, radius)

  context.restore()

  context.save()
  const innerStrokeGradient = context.createLinearGradient(
    x,
    y,
    x + width,
    y + height,
  )
  innerStrokeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.28)')
  innerStrokeGradient.addColorStop(0.34, 'rgba(255, 255, 255, 0.05)')
  innerStrokeGradient.addColorStop(0.72, 'rgba(255, 255, 255, 0.04)')
  innerStrokeGradient.addColorStop(1, 'rgba(255, 255, 255, 0.16)')
  context.strokeStyle = innerStrokeGradient
  context.lineWidth = 1
  context.beginPath()
  createRoundedRectPath(
    context,
    x + 0.75,
    y + 0.75,
    width - 1.5,
    height - 1.5,
    radius - 0.75,
  )
  context.stroke()
  context.restore()
}

function drawPnlPanelBorder(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  context.save()
  context.strokeStyle = PNL_PANEL_BORDER_COLOR
  context.lineWidth = PNL_PANEL_BORDER_WIDTH
  context.beginPath()
  createRoundedRectPath(
    context,
    x + PNL_PANEL_BORDER_WIDTH / 2,
    y + PNL_PANEL_BORDER_WIDTH / 2,
    width - PNL_PANEL_BORDER_WIDTH,
    height - PNL_PANEL_BORDER_WIDTH,
    radius - PNL_PANEL_BORDER_WIDTH / 2,
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

function drawTokenBadge(
  context: CanvasRenderingContext2D,
  symbol: string,
  tokenIcon: HTMLImageElement | undefined,
  x: number,
  y: number,
): number {
  const height = 45
  const iconSize = 29
  const label = symbol.length > 10 ? `${symbol.slice(0, 10)}...` : symbol

  context.save()
  context.font = '600 20px Inter, sans-serif'
  const width = 15 + iconSize + 10 + context.measureText(label).width + 17
  drawTokenBadgeRect(context, x, y, width, height, height / 2)

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
): void {
  drawTradeBadgeOuterShadows(context, x, y, width, height, radius)

  const backgroundGradient = context.createLinearGradient(0, y, 0, y + height)
  backgroundGradient.addColorStop(0, 'rgba(237, 241, 243, 0.05)')
  backgroundGradient.addColorStop(1, 'rgba(237, 241, 243, 0.015)')

  context.save()
  context.fillStyle = backgroundGradient
  fillRoundedRect(context, x, y, width, height, radius)
  context.restore()

  drawTradeBadgeInsetShadows(context, x, y, width, height, radius)
  drawPnlPanelLiquidGlassEdge(context, x, y, width, height, radius, 4)
  drawPnlPanelBorder(context, x, y, width, height, radius)
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

  drawTradeBadgeOuterShadows(context, x, y, width, height, radius)

  context.fillStyle = panelGradient
  fillRoundedRect(context, x, y, width, height, radius)

  drawTradeBadgeInsetShadows(context, x, y, width, height, radius)
  drawPnlPanelLiquidGlassEdge(context, x, y, width, height, radius, 4)
  drawPnlPanelBorder(context, x, y, width, height, radius)
}

function drawTradeBadgeOuterShadows(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  for (const shadow of TRADE_BADGE_OUTER_SHADOWS) {
    drawPanelOuterShadow(
      context,
      x,
      y,
      width,
      height,
      radius,
      shadow.color,
      shadow.blur,
      shadow.offsetY,
    )
  }
}

function drawTradeBadgeInsetShadows(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  for (const shadow of TRADE_BADGE_INSET_SHADOWS) {
    drawRoundedRectInsetShadow(context, x, y, width, height, radius, shadow)
  }
}

function drawRoundedRectInsetShadow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  shadow: PosterVerticalShadow,
): void {
  const insetHighlightHeight = Math.max(1, shadow.blur * 3 + shadow.offsetY)

  context.save()
  context.beginPath()
  createRoundedRectPath(context, x, y, width, height, radius)
  context.clip()
  context.shadowColor = shadow.color
  context.shadowBlur = shadow.blur
  context.shadowOffsetY = shadow.offsetY
  context.fillStyle = shadow.color
  context.fillRect(
    x,
    y - shadow.offsetY - insetHighlightHeight,
    width,
    insetHighlightHeight,
  )
  context.restore()
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
  const font = `500 ${fontSize}px Inter, sans-serif`
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
    '#FFFFFF12',
    2.87,
    2.87,
  )
  drawTextInsetShadow(
    textContext,
    label,
    font,
    textX,
    textY,
    textCanvas.width / POSTER_SCALE,
    textCanvas.height / POSTER_SCALE,
    '#FFFFFF80',
    0.76,
    0.76,
  )
  drawTextTopHighlight(textContext, label, font, textX, textY, textHeight)

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
    '#FFFFFF12',
    2.87,
    2.87,
  )
  drawTextInsetShadow(
    textContext,
    largeValue,
    font,
    textX,
    textY,
    textCanvas.width / POSTER_SCALE,
    textCanvas.height / POSTER_SCALE,
    '#FFFFFF80',
    0.76,
    0.76,
  )
  drawTextTopHighlight(textContext, largeValue, font, textX, textY, textHeight)

  context.drawImage(
    textCanvas,
    x - padding,
    y - padding,
    textWidth + padding * 2,
    textHeight + padding * 2,
  )
  context.restore()
}

function drawTextTopHighlight(
  context: CanvasRenderingContext2D,
  text: string,
  font: string,
  x: number,
  y: number,
  textHeight: number,
): void {
  const highlightGradient = context.createLinearGradient(
    0,
    y,
    0,
    y + textHeight * 0.55,
  )

  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.38)')
  highlightGradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.14)')
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  context.save()
  context.globalCompositeOperation = 'source-atop'
  context.font = font
  context.textBaseline = 'top'
  context.fillStyle = highlightGradient
  context.fillText(text, x, y)
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
    overlayColor2: '#000000',
    overlayOpacity2: 0.3,
    overlayBlur2: 10,
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
    overlayColor2: '#000000',
    overlayOpacity2: 0.3,
    overlayBlur2: 10,
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
  overlayColor2?: string
  overlayOpacity2?: number
  overlayBlur2?: number
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
  if (options.overlayColor2) {
    drawBlurredImageOverlay(
      context,
      image,
      -width / 2,
      -height / 2,
      width,
      height,
      options.overlayColor2,
      options.overlayOpacity2 ?? 0.25,
      options.overlayBlur2 ?? 5,
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
