import { SushiIconBase } from '@sushiswap/ui/icons/SushiIcon'
import type { ReactNode } from 'react'
import { ChainId } from 'sushi'
import type { LaunchpadChainId } from '../constants'

const CARD_BACKGROUND = '#0D1217'
const PINK = '#FF8ECA'
const UP_COLOR = '#33E093'
const DOWN_COLOR = '#FF5F72'
const MONO = 'JetBrains Mono'
const SANS = 'Montserrat'

export interface LaunchpadEmbedStat {
  label: string
  value: string
}

export interface LaunchpadEmbedSparkline {
  areaPath: string
  isUp: boolean
  linePath: string
}

/** The mark-only card — nothing here can go stale. */
export function LaunchpadDiscoverEmbed({
  chainId,
  chainName,
}: {
  chainId?: LaunchpadChainId
  chainName: string
}) {
  return (
    <EmbedCard padding="60px 64px">
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 34,
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 34 }}>
          <SushiMark size={132} />
          <Wordmark size={118} />
        </div>
        <LaunchpadWord size={52} />
        <div style={{ display: 'flex', marginTop: 18 }}>
          <ChainBadge chainId={chainId} chainName={chainName} />
        </div>
      </div>
    </EmbedCard>
  )
}

export function LaunchpadTokenEmbed({
  chainId,
  chainName,
  changePercent,
  logoDataUrl,
  marketCap,
  name,
  sparkline,
  stats,
  symbol,
}: {
  chainId?: LaunchpadChainId
  chainName: string
  changePercent: number | null
  logoDataUrl?: string
  marketCap: string
  name: string
  sparkline?: LaunchpadEmbedSparkline
  stats: LaunchpadEmbedStat[]
  symbol: string
}) {
  return (
    <EmbedCard
      background={sparkline ? <Sparkline sparkline={sparkline} /> : null}
      padding="52px 64px 48px"
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 18 }}>
          <SushiMark size={46} />
          <Wordmark size={35} />
          <LaunchpadWord size={17} />
        </div>
        <ChainBadge chainId={chainId} chainName={chainName} />
      </div>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 30,
          marginTop: 40,
        }}
      >
        <TokenLogo logoDataUrl={logoDataUrl} size={132} symbol={symbol} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 74,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.22,
              maxWidth: 800,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: PINK,
              display: 'flex',
              fontFamily: MONO,
              fontSize: 31,
              fontWeight: 700,
            }}
          >
            ${symbol}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexGrow: 1 }} />

      <div
        style={{
          alignItems: 'flex-end',
          display: 'flex',
          gap: 40,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <EmbedLabel>Market cap</EmbedLabel>
          <div style={{ alignItems: 'baseline', display: 'flex', gap: 22 }}>
            <EmbedNumber size={92}>{marketCap}</EmbedNumber>
            {changePercent === null ? null : (
              <ChangeBadge changePercent={changePercent} />
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, paddingBottom: 10 }}>
          {stats.map((stat, index) => (
            <div key={stat.label} style={{ display: 'flex', gap: 40 }}>
              {index === 0 ? null : <VerticalRule />}
              <div
                style={{
                  alignItems: 'flex-end',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <EmbedLabel>{stat.label}</EmbedLabel>
                <EmbedNumber size={42}>{stat.value}</EmbedNumber>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmbedCard>
  )
}

function EmbedCard({
  background,
  children,
  padding,
}: {
  background?: ReactNode
  children: ReactNode
  padding: string
}) {
  return (
    <div
      style={{
        backgroundColor: CARD_BACKGROUND,
        color: '#FFFFFF',
        display: 'flex',
        fontFamily: SANS,
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      <GlowBand />
      {background}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding,
          position: 'relative',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function GlowBand() {
  return (
    <div
      style={{
        display: 'flex',
        height: 520,
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      <div
        style={{
          background: 'rgba(52, 155, 254, 0.08)',
          borderRadius: 9999,
          display: 'flex',
          filter: 'blur(64px)',
          height: 288,
          left: 60,
          position: 'absolute',
          top: 0,
          width: 288,
        }}
      />
      <div
        style={{
          background: 'rgba(236, 72, 153, 0.06)',
          borderRadius: 9999,
          display: 'flex',
          filter: 'blur(64px)',
          height: 320,
          position: 'absolute',
          right: 96,
          top: 64,
          width: 320,
        }}
      />
    </div>
  )
}

function Sparkline({ sparkline }: { sparkline: LaunchpadEmbedSparkline }) {
  const color = sparkline.isUp ? UP_COLOR : DOWN_COLOR

  return (
    <div
      style={{
        bottom: 0,
        display: 'flex',
        height: 300,
        left: 0,
        position: 'absolute',
        width: 1200,
      }}
    >
      <svg height={300} viewBox="0 0 1200 300" width={1200}>
        <defs>
          <linearGradient
            id="launchpad-embed-spark"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop offset="0" stopColor={color} stopOpacity="0.32" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={sparkline.areaPath} fill="url(#launchpad-embed-spark)" />
        <path
          d={sparkline.linePath}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
        />
      </svg>
      <div
        style={{
          backgroundImage:
            'linear-gradient(0deg, rgba(13, 18, 23, 0.96) 0%, rgba(13, 18, 23, 0.9) 40%, rgba(13, 18, 23, 0) 100%)',
          bottom: 0,
          display: 'flex',
          height: 300,
          left: 0,
          position: 'absolute',
          width: 1200,
        }}
      />
    </div>
  )
}

function TokenLogo({
  logoDataUrl,
  size,
  symbol,
}: {
  logoDataUrl?: string
  size: number
  symbol: string
}) {
  return (
    <div
      style={{
        alignItems: 'center',
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.025))',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: 9999,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
        display: 'flex',
        flexShrink: 0,
        height: size,
        justifyContent: 'center',
        overflow: 'hidden',
        width: size,
      }}
    >
      {logoDataUrl ? (
        <img
          alt=""
          height={size}
          src={logoDataUrl}
          // satori will not clip the image to the parent's radius on its own.
          style={{
            borderRadius: 9999,
            height: size,
            objectFit: 'cover',
            width: size,
          }}
          width={size}
        />
      ) : (
        <div
          style={{
            alignItems: 'center',
            background: 'linear-gradient(155deg, #6E4BE6, #3B2196)',
            display: 'flex',
            fontSize: Math.round(size * 0.5),
            fontWeight: 800,
            height: '100%',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {symbol.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

function ChangeBadge({ changePercent }: { changePercent: number }) {
  const isUp = changePercent >= 0
  const color = isUp ? UP_COLOR : DOWN_COLOR

  return (
    <div
      style={{
        alignItems: 'center',
        color,
        display: 'flex',
        fontFamily: MONO,
        fontSize: 36,
        fontWeight: 700,
        gap: 12,
      }}
    >
      {/* Drawn rather than typed — the glyph fonts here do not ship ▲/▼. */}
      <svg
        height={22}
        style={{ marginBottom: 6 }}
        viewBox="0 0 24 24"
        width={22}
      >
        <path
          d={isUp ? 'M12 4 L22 20 L2 20 Z' : 'M12 20 L2 4 L22 4 Z'}
          fill={color}
        />
      </svg>
      {`${Math.abs(changePercent).toFixed(1)}%`}
    </div>
  )
}

function ChainBadge({
  chainId,
  chainName,
}: {
  chainId?: LaunchpadChainId
  chainName: string
}) {
  return (
    <div
      style={{
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: 9999,
        color: 'rgba(255, 255, 255, 0.86)',
        display: 'flex',
        fontSize: 18,
        fontWeight: 700,
        gap: 12,
        padding: '9px 22px 9px 9px',
        whiteSpace: 'nowrap',
      }}
    >
      <ChainMark chainId={chainId} size={30} />
      {chainName}
    </div>
  )
}

/** Mirrors RobinhoodNaked from @sushiswap/ui, inlined for satori. */
function ChainMark({
  chainId,
  size,
}: {
  chainId?: LaunchpadChainId
  size: number
}) {
  if (chainId !== ChainId.ROBINHOOD) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: 9999,
          display: 'flex',
          flexShrink: 0,
          height: size,
          width: size,
        }}
      />
    )
  }

  return (
    <svg height={size} viewBox="0 0 128 128" width={size}>
      <rect fill="#CCFF00" height="128" rx="64" width="128" />
      <path
        d="M59.392 42.496L65.024 35.84C69.12 31.232 70.656 29.184 78.336 29.184H86.528C91.648 29.184 93.184 31.744 93.184 38.4C93.184 42.496 92.672 45.568 91.136 49.152L79.872 64.512L79.36 43.52L78.336 42.496H59.392ZM55.808 46.08H72.704L66.56 52.736L54.272 69.632L41.984 92.672L37.888 103.936H34.816L42.496 80.896L43.008 61.952L55.808 46.08ZM74.752 49.664H75.776V70.144L70.656 78.848L66.56 83.968L48.64 89.088L57.344 72.704L74.752 49.664Z"
        fill="#000000"
      />
    </svg>
  )
}

function SushiMark({ size }: { size: number }) {
  return (
    <SushiIconBase
      gradientId="launchpad-embed-sushi-gradient"
      height={size}
      style={{ flexShrink: 0 }}
      width={size}
    />
  )
}

function Wordmark({ size }: { size: number }) {
  return (
    <div
      style={{
        display: 'flex',
        fontSize: size,
        fontWeight: 800,
        letterSpacing: '-0.035em',
        lineHeight: 1,
      }}
    >
      Sushi
    </div>
  )
}

function LaunchpadWord({ size }: { size: number }) {
  return (
    <div
      style={{
        color: PINK,
        display: 'flex',
        fontSize: size,
        fontWeight: 900,
        letterSpacing: '0.26em',
        lineHeight: 1,
        // Trailing tracking would otherwise offset the lockup to the left.
        marginRight: '-0.26em',
      }}
    >
      LAUNCHPAD
    </div>
  )
}

function EmbedLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        fontFamily: MONO,
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: '0.12em',
        lineHeight: 1,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  )
}

function EmbedNumber({
  children,
  size,
}: {
  children: ReactNode
  size: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        fontSize: size,
        fontWeight: 800,
        letterSpacing: '-0.025em',
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  )
}

function VerticalRule() {
  return (
    <div
      style={{
        alignSelf: 'stretch',
        backgroundImage:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.02))',
        display: 'flex',
        flexShrink: 0,
        width: 1,
      }}
    />
  )
}
