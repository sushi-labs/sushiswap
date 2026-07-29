export const MAX_LAUNCHPAD_LOGO_BYTES = 1024 * 1024
export const MAX_LAUNCHPAD_LOGO_DIMENSION = 512

const MAX_SOURCE_LOGO_BYTES = 20 * 1024 * 1024
const WEBP_QUALITY_STEPS = [0.9, 0.8, 0.7, 0.6] as const

export type LaunchpadLogoContentType = 'image/jpeg' | 'image/png' | 'image/webp'

export interface PreparedLaunchpadLogoFile {
  file: File
  contentType: LaunchpadLogoContentType
  width: number
  height: number
  originalBytes: number
  originalWidth: number
  originalHeight: number
  wasOptimized: boolean
}

function matchesBytes(
  bytes: Uint8Array,
  offset: number,
  expected: readonly number[],
): boolean {
  return expected.every((byte, index) => bytes[offset + index] === byte)
}

export function detectLaunchpadLogoContentType(
  bytes: Uint8Array,
): LaunchpadLogoContentType | null {
  if (
    matchesBytes(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  ) {
    return 'image/png'
  }

  if (matchesBytes(bytes, 0, [0xff, 0xd8, 0xff])) {
    return 'image/jpeg'
  }

  if (
    matchesBytes(bytes, 0, [0x52, 0x49, 0x46, 0x46]) &&
    matchesBytes(bytes, 8, [0x57, 0x45, 0x42, 0x50])
  ) {
    return 'image/webp'
  }

  return null
}

export function fitLaunchpadLogoDimensions(
  width: number,
  height: number,
): { width: number; height: number } {
  const scale = Math.min(
    1,
    MAX_LAUNCHPAD_LOGO_DIMENSION / width,
    MAX_LAUNCHPAD_LOGO_DIMENSION / height,
  )

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  contentType: LaunchpadLogoContentType,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('The image could not be resized')),
      contentType,
      quality,
    )
  })
}

function optimizedLogoName(fileName: string): string {
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'token-logo'
  return `${baseName}.webp`
}

async function optimizeLaunchpadLogo(
  file: File,
  image: ImageBitmap,
): Promise<File> {
  const dimensions = fitLaunchpadLogoDimensions(image.width, image.height)
  const canvas = document.createElement('canvas')
  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('The image could not be resized')

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, 0, 0, dimensions.width, dimensions.height)

  for (const quality of WEBP_QUALITY_STEPS) {
    const blob = await canvasToBlob(canvas, 'image/webp', quality)
    if (blob.size === 0 || blob.size > MAX_LAUNCHPAD_LOGO_BYTES) continue

    const bytes = new Uint8Array(await blob.arrayBuffer())
    if (detectLaunchpadLogoContentType(bytes) !== 'image/webp') continue

    return new File([blob], optimizedLogoName(file.name), {
      type: 'image/webp',
      lastModified: file.lastModified,
    })
  }

  throw new Error('The image could not be resized below 1 MB')
}

export async function prepareLaunchpadLogoFile(
  file: File,
): Promise<PreparedLaunchpadLogoFile> {
  if (file.size === 0) throw new Error('The logo file is empty')
  if (file.size > MAX_SOURCE_LOGO_BYTES) {
    throw new Error('Choose an image smaller than 20 MB')
  }

  const originalBytes = new Uint8Array(await file.arrayBuffer())
  const originalContentType = detectLaunchpadLogoContentType(originalBytes)
  if (!originalContentType) {
    throw new Error('Choose a PNG, JPEG, or WebP image')
  }

  let image: ImageBitmap
  try {
    image = await createImageBitmap(
      new Blob([originalBytes], { type: originalContentType }),
    )
  } catch {
    throw new Error('The image file is damaged or could not be decoded')
  }

  try {
    if (image.width < 1 || image.height < 1) {
      throw new Error('The image dimensions are invalid')
    }

    const needsOptimization =
      file.size > MAX_LAUNCHPAD_LOGO_BYTES ||
      image.width > MAX_LAUNCHPAD_LOGO_DIMENSION ||
      image.height > MAX_LAUNCHPAD_LOGO_DIMENSION
    const preparedFile = needsOptimization
      ? await optimizeLaunchpadLogo(file, image)
      : file
    const preparedBytes = needsOptimization
      ? new Uint8Array(await preparedFile.arrayBuffer())
      : originalBytes
    const contentType = detectLaunchpadLogoContentType(preparedBytes)

    if (
      !contentType ||
      preparedFile.size === 0 ||
      preparedFile.size > MAX_LAUNCHPAD_LOGO_BYTES
    ) {
      throw new Error('The processed logo does not meet the upload limits')
    }

    const dimensions = fitLaunchpadLogoDimensions(image.width, image.height)
    return {
      file: preparedFile,
      contentType,
      width: needsOptimization ? dimensions.width : image.width,
      height: needsOptimization ? dimensions.height : image.height,
      originalBytes: file.size,
      originalWidth: image.width,
      originalHeight: image.height,
      wasOptimized: needsOptimization,
    }
  } finally {
    image.close()
  }
}
