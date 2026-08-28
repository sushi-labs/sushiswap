import type { CSSProperties } from 'react'

/**
 * Deterministic generative art for tokens whose logo cannot be resolved — the
 * "Aurora" fallback: two wide sweeps and a conic veil over a two-hue base.
 *
 * Every value (hue pair, sweep positions, angles) is derived from a 32-bit
 * FNV-1a hash of `${chainId}:${address}`, so the same token renders the same
 * art on every device with no network calls and no stored data. It is four
 * stacked CSS gradients on the node that already exists: no filters, no blur,
 * no animation.
 */

const FNV_OFFSET_BASIS = 0x811c9dc5
const FNV_PRIME = 0x01000193

function fnv1a(value: string): number {
  let hash = FNV_OFFSET_BASIS

  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, FNV_PRIME) >>> 0
  }

  return hash >>> 0
}

/** Mulberry32 — cheap, and identical across engines for a given seed. */
function createRandom(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

/** On-brand hue pairs: blue, pink, purple, green, amber, red, teal, lime. */
const HUE_PAIRS = [
  [212, 258],
  [330, 292],
  [266, 208],
  [152, 188],
  [38, 12],
  [352, 20],
  [186, 158],
  [86, 46],
] as const

const MONOGRAM_SIZE_RATIO = 0.38

/**
 * The token identity the art is derived from. Only the string form matters, so
 * this accepts an address of any chain type verbatim.
 */
export interface TokenFallbackIconSeed {
  address: string
  chainId: number | string
}

function auroraBackground({ address, chainId }: TokenFallbackIconSeed): string {
  const seed = fnv1a(`${chainId}:${address.toLowerCase()}`)
  const random = createRandom(seed)
  const randomInt = (min: number, max: number) =>
    min + Math.floor(random() * (max - min + 1))
  const [lead, trail] = HUE_PAIRS[seed % HUE_PAIRS.length]

  // Every `randomInt` call advances one shared sequence, so the art only stays
  // reproducible while these layers are built in this order.
  return [
    `radial-gradient(120% 90% at ${randomInt(0, 100)}% ${randomInt(-20, 40)}%, hsl(${lead} 96% 78% / 0.85), transparent 65%)`,
    `radial-gradient(110% 80% at ${randomInt(0, 100)}% ${randomInt(60, 120)}%, hsl(${trail} 92% 62% / 0.9), transparent 68%)`,
    `conic-gradient(from ${randomInt(0, 359)}deg at 50% 50%, hsl(${lead} 80% 46% / 0.55), transparent 40%, hsl(${trail} 80% 52% / 0.5) 75%, transparent)`,
    `linear-gradient(${randomInt(0, 359)}deg, hsl(${trail} 74% 30%), hsl(${lead} 78% 46%))`,
  ].join(',')
}

/**
 * Style for the fallback surface itself — the aurora art, its inset ring, and
 * the monogram typography, scaled to the icon's rendered size in pixels.
 */
export function getTokenFallbackIconStyle(
  seed: TokenFallbackIconSeed,
  sizeInPixels: number,
): CSSProperties {
  return {
    background: auroraBackground(seed),
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.94)',
    fontSize: Math.round(sizeInPixels * MONOGRAM_SIZE_RATIO),
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    textShadow: '0 1px 8px rgba(0,0,0,0.45)',
  }
}

/** The single character painted over the art. */
export function getTokenFallbackMonogram(symbol: string | undefined): string {
  return symbol?.charAt(0).toUpperCase() || '?'
}
