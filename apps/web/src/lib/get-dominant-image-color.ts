const SAMPLE_SIZE = 32

interface ColorBucket {
  count: number
  red: number
  green: number
  blue: number
}

function getDominantColor(pixels: Uint8ClampedArray): string | null {
  const buckets = new Map<number, ColorBucket>()
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue

    const red = pixels[i]
    const green = pixels[i + 1]
    const blue = pixels[i + 2]
    // Group nearby shades so gradients and antialiasing still produce a main color.
    const key = ((red >> 5) << 6) | ((green >> 5) << 3) | (blue >> 5)
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.count++
      bucket.red += red
      bucket.green += green
      bucket.blue += blue
    } else {
      buckets.set(key, { count: 1, red, green, blue })
    }
  }

  const palette = Array.from(buckets.values()).sort((a, b) => b.count - a.count)
  const largest = palette[0]
  if (!largest) return null
  // Prefer the logo's identifying hue over white or muted icon backgrounds.
  const dominant =
    palette.find(
      ({ red, green, blue, count }) =>
        count >= largest.count * 0.1 &&
        Math.max(red, green, blue) - Math.min(red, green, blue) >= 48 * count,
    ) ?? largest
  return `#${[dominant.red, dominant.green, dominant.blue]
    .map((sum) =>
      Math.round(sum / dominant.count)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

export async function getDominantImageColor(
  src: string,
): Promise<string | null> {
  try {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = src
    await image.decode()

    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = SAMPLE_SIZE
    const context = canvas.getContext('2d')
    if (!context) return null

    context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
    return getDominantColor(
      context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data,
    )
  } catch {
    // Missing icons and cross-origin images without pixel access use the caller's fallback.
    return null
  }
}
