export interface LaunchpadEmbedFont {
  data: ArrayBuffer
  name: string
  style: 'normal'
  weight: 700 | 800 | 900
}

/**
 * Versioned, immutable Google Fonts payloads. satori cannot read woff2, so these
 * are the truetype variants. Kept out of the repo on purpose — the responses are
 * cached indefinitely by the Next data cache and memoized per instance below.
 */
const FONT_SOURCES = [
  {
    name: 'Montserrat',
    url: 'https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-.ttf',
    weight: 700,
  },
  {
    name: 'Montserrat',
    url: 'https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr70w-.ttf',
    weight: 800,
  },
  {
    name: 'Montserrat',
    url: 'https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvC70w-.ttf',
    weight: 900,
  },
  {
    name: 'JetBrains Mono',
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6tjPQ.ttf',
    weight: 700,
  },
] as const satisfies readonly {
  name: string
  url: string
  weight: LaunchpadEmbedFont['weight']
}[]

let cachedFonts: Promise<LaunchpadEmbedFont[]> | undefined

async function loadFont(
  source: (typeof FONT_SOURCES)[number],
): Promise<LaunchpadEmbedFont | null> {
  try {
    const response = await fetch(source.url, { next: { revalidate: false } })
    if (!response.ok) return null

    return {
      data: await response.arrayBuffer(),
      name: source.name,
      style: 'normal',
      weight: source.weight,
    }
  } catch {
    return null
  }
}

/**
 * Fonts for the launchpad embeds. Returns an empty array when they cannot be
 * fetched — pass it to `ImageResponse` only when non-empty so satori falls back
 * to its built-in font instead of failing the image.
 */
export async function getLaunchpadEmbedFonts(): Promise<LaunchpadEmbedFont[]> {
  if (!cachedFonts) {
    cachedFonts = Promise.all(FONT_SOURCES.map(loadFont)).then((fonts) =>
      fonts.filter((font): font is LaunchpadEmbedFont => font !== null),
    )
  }

  const fonts = await cachedFonts
  // Don't hold a failed fetch for the lifetime of the instance.
  if (fonts.length === 0) cachedFonts = undefined

  return fonts
}
