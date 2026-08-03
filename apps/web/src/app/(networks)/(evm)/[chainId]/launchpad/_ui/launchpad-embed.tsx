import type { ReactNode } from 'react'

export interface LaunchpadEmbedStat {
  label: string
  value: string
}

export function LaunchpadEmbed({
  chainName,
  title,
  subtitle,
  symbol,
  logoDataUrl,
  primaryStat,
  stats,
}: {
  chainName: string
  title: string
  subtitle: string
  symbol?: string
  logoDataUrl?: string
  primaryStat?: LaunchpadEmbedStat
  stats: LaunchpadEmbedStat[]
}) {
  const isToken = Boolean(symbol)

  return (
    <div
      style={{
        alignItems: 'stretch',
        backgroundColor: '#0D1217',
        backgroundImage:
          'linear-gradient(145deg, rgba(52, 155, 254, 0.17) 0%, rgba(13, 18, 23, 0) 38%), linear-gradient(315deg, rgba(236, 72, 153, 0.1) 0%, rgba(13, 18, 23, 0) 35%)',
        color: '#EDF0F3',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '54px 64px 56px',
        position: 'relative',
        width: '100%',
      }}
    >
      <EmbedGrid />
      <Glow
        color="rgba(52, 155, 254, 0.14)"
        height={360}
        left={-100}
        top={-150}
        width={420}
      />
      <Glow
        color="rgba(236, 72, 153, 0.1)"
        height={360}
        right={-80}
        top={70}
        width={360}
      />

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexShrink: 0,
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <SushiMark />
          <div
            style={{
              fontSize: 27,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Sushi
          </div>
          <div
            style={{
              background: 'rgba(52, 155, 254, 0.11)',
              border: '1px solid rgba(52, 155, 254, 0.24)',
              borderRadius: 999,
              color: '#74B9FF',
              display: 'flex',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.12em',
              padding: '9px 15px 8px',
              textTransform: 'uppercase',
            }}
          >
            Launchpad
          </div>
        </div>
        <div
          style={{
            color: 'rgba(237, 240, 243, 0.52)',
            display: 'flex',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {chainName}
        </div>
      </div>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 0,
          flexShrink: 0,
          height: 280,
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div
          style={{
            alignItems: isToken ? 'center' : 'flex-start',
            display: 'flex',
            gap: isToken ? 28 : 0,
            maxWidth: isToken ? 690 : 880,
          }}
        >
          {isToken ? (
            <div
              style={{
                alignItems: 'center',
                background:
                  'linear-gradient(180deg, rgba(237, 240, 243, 0.09), rgba(237, 240, 243, 0.025))',
                border: '1px solid rgba(237, 240, 243, 0.14)',
                borderRadius: 999,
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
                display: 'flex',
                height: 116,
                justifyContent: 'center',
                overflow: 'hidden',
                width: 116,
              }}
            >
              {logoDataUrl ? (
                <img
                  alt=""
                  height="116"
                  src={logoDataUrl}
                  style={{
                    height: 116,
                    objectFit: 'cover',
                    width: 116,
                  }}
                  width="116"
                />
              ) : (
                <div
                  style={{
                    alignItems: 'center',
                    background: 'rgba(52, 155, 254, 0.2)',
                    color: '#EDF0F3',
                    display: 'flex',
                    fontSize: 52,
                    fontWeight: 800,
                    height: '100%',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  {symbol?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: '#EDF0F3',
                display: 'flex',
                fontSize: isToken ? 58 : 68,
                fontWeight: 750,
                letterSpacing: '-0.045em',
                lineHeight: 1.02,
                maxWidth: isToken ? 540 : 880,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: isToken ? 'nowrap' : 'normal',
              }}
            >
              {title}
            </div>
            {symbol ? (
              <div
                style={{
                  color: '#74B9FF',
                  display: 'flex',
                  fontSize: 25,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  marginTop: 10,
                }}
              >
                ${symbol}
              </div>
            ) : null}
            <div
              style={{
                color: 'rgba(237, 240, 243, 0.58)',
                display: 'flex',
                fontSize: 20,
                lineHeight: 1.4,
                marginTop: isToken ? 12 : 18,
                maxWidth: 760,
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>

        {primaryStat ? (
          <div
            style={{
              alignItems: 'flex-end',
              background:
                'linear-gradient(180deg, rgba(52, 155, 254, 0.12), rgba(52, 155, 254, 0.035))',
              border: '1px solid rgba(116, 185, 255, 0.2)',
              borderRadius: 24,
              boxShadow:
                'inset 1px 1px 0 rgba(255, 255, 255, 0.11), 0 24px 60px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 290,
              padding: '27px 30px 25px',
            }}
          >
            <StatLabel>{primaryStat.label}</StatLabel>
            <div
              style={{
                color: '#EDF0F3',
                display: 'flex',
                fontSize: 42,
                fontWeight: 750,
                letterSpacing: '-0.035em',
                marginTop: 10,
              }}
            >
              {primaryStat.value}
            </div>
          </div>
        ) : null}
      </div>

      <div
        style={{
          background:
            'linear-gradient(180deg, rgba(237, 240, 243, 0.055), rgba(237, 240, 243, 0.018))',
          border: '1px solid rgba(237, 240, 243, 0.085)',
          borderRadius: 22,
          boxShadow: 'inset 1px 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexShrink: 0,
          height: 112,
          minHeight: 112,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            style={{
              borderLeft:
                index === 0 ? 'none' : '1px solid rgba(237, 240, 243, 0.07)',
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '22px 30px 20px',
            }}
          >
            <StatLabel>{stat.label}</StatLabel>
            <div
              style={{
                color: '#EDF0F3',
                display: 'flex',
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                marginTop: 8,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: 'rgba(237, 240, 243, 0.5)',
        display: 'flex',
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  )
}

function SushiMark() {
  return (
    <div
      style={{
        alignItems: 'center',
        background:
          'linear-gradient(145deg, rgba(52, 155, 254, 0.28), rgba(236, 72, 153, 0.22))',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 12,
        display: 'flex',
        height: 44,
        justifyContent: 'center',
        width: 44,
      }}
    >
      <svg height="28" viewBox="100.91 115.61 308.88 258.44" width="31">
        <path
          d="M244.453 253.216c-68.94-37.824-107.902-99.376-87.166-137.607l-48.647 89.032.01.01c-.46.67-.9 1.35-1.31 2.05-.26.43-.51.87-.76 1.31-20.96 38.22 18.02 99.91 87.07 137.8s142.03 37.62 163-.6c.68-1.24 1.3-2.5 1.85-3.79l46.1-84.291c-24.114 33.657-93.93 32.417-160.147-3.914Z"
          fill="#fff"
        />
        <ellipse
          cx="282.419"
          cy="184.018"
          fill="#fff"
          rx="31.27"
          ry="59.194"
          transform="rotate(-61.25 282.419 184.018)"
        />
      </svg>
    </div>
  )
}

function EmbedGrid() {
  return (
    <div
      style={{
        bottom: 0,
        display: 'flex',
        left: 0,
        opacity: 0.36,
        position: 'absolute',
        right: 0,
        top: 0,
      }}
    >
      {[15, 31, 47, 63, 79, 95].map((left) => (
        <div
          key={`vertical-${left}`}
          style={{
            background: 'rgba(237, 240, 243, 0.035)',
            bottom: 0,
            display: 'flex',
            left: `${left}%`,
            position: 'absolute',
            top: 0,
            width: 1,
          }}
        />
      ))}
      {[24, 48, 72, 96].map((top) => (
        <div
          key={`horizontal-${top}`}
          style={{
            background: 'rgba(237, 240, 243, 0.03)',
            display: 'flex',
            height: 1,
            left: 0,
            position: 'absolute',
            right: 0,
            top: `${top}%`,
          }}
        />
      ))}
    </div>
  )
}

function Glow({
  color,
  height,
  left,
  right,
  top,
  width,
}: {
  color: string
  height: number
  left?: number
  right?: number
  top: number
  width: number
}) {
  return (
    <div
      style={{
        background: color,
        borderRadius: 999,
        display: 'flex',
        filter: 'blur(80px)',
        height,
        position: 'absolute',
        top,
        width,
        ...(left === undefined ? {} : { left }),
        ...(right === undefined ? {} : { right }),
      }}
    />
  )
}
