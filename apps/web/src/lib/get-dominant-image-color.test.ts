import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDominantImageColor } from './get-dominant-image-color'

describe('getDominantImageColor', () => {
  const getImageData = vi.fn<() => { data: Uint8ClampedArray }>()
  const decode = vi.fn<() => Promise<void>>()

  beforeEach(() => {
    decode.mockResolvedValue(undefined)
    vi.stubGlobal(
      'Image',
      class {
        decode = decode
      },
    )
    vi.stubGlobal('document', {
      createElement: () => ({
        getContext: () => ({ drawImage: vi.fn(), getImageData }),
      }),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetAllMocks()
  })

  it('groups logo shades and ignores transparent pixels and muted backgrounds', async () => {
    getImageData.mockReturnValue({
      data: new Uint8ClampedArray(
        [
          ...Array<number[]>(8).fill([255, 0, 0, 0]),
          ...Array<number[]>(5).fill([19, 29, 53, 255]),
          ...Array<number[]>(4).fill([255, 255, 255, 255]),
          [70, 120, 250, 255],
          [72, 122, 252, 255],
        ].flat(),
      ),
    })
    expect(await getDominantImageColor('icon.svg')).toBe('#4779fb')
  })

  it('retains the dominant shade of a monochrome logo', async () => {
    getImageData.mockReturnValue({
      data: new Uint8ClampedArray([51, 51, 51, 255]),
    })
    expect(await getDominantImageColor('icon.svg')).toBe('#333333')
  })

  it('returns null for a transparent or unreadable image', async () => {
    getImageData.mockReturnValueOnce({ data: new Uint8ClampedArray(4) })
    expect(await getDominantImageColor('empty.svg')).toBeNull()
    getImageData.mockImplementationOnce(() => {
      throw new DOMException('Cross-origin canvas', 'SecurityError')
    })
    expect(await getDominantImageColor('unreadable.svg')).toBeNull()
    decode.mockRejectedValueOnce(new Error('Image failed to load'))
    expect(await getDominantImageColor('missing.svg')).toBeNull()
  })
})
