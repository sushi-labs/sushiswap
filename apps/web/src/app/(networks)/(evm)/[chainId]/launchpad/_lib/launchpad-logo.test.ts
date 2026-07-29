import { describe, expect, it } from 'vitest'
import {
  MAX_LAUNCHPAD_LOGO_BYTES,
  MAX_LAUNCHPAD_LOGO_DIMENSION,
  detectLaunchpadLogoContentType,
  fitLaunchpadLogoDimensions,
} from './launchpad-logo'

describe('launchpad logo validation', () => {
  it('matches the backend byte and dimension limits', () => {
    expect(MAX_LAUNCHPAD_LOGO_BYTES).toBe(1024 * 1024)
    expect(MAX_LAUNCHPAD_LOGO_DIMENSION).toBe(512)
  })

  it.each([
    ['PNG', [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 'image/png'],
    ['JPEG', [0xff, 0xd8, 0xff, 0xe0], 'image/jpeg'],
    [
      'WebP',
      [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50],
      'image/webp',
    ],
  ])('detects %s from its bytes', (_name, bytes, expected) => {
    expect(detectLaunchpadLogoContentType(Uint8Array.from(bytes))).toBe(
      expected,
    )
  })

  it('rejects content whose extension or browser MIME could be misleading', () => {
    expect(
      detectLaunchpadLogoContentType(
        new TextEncoder().encode('<svg><script /></svg>'),
      ),
    ).toBeNull()
  })

  it('resizes proportionally without enlarging valid images', () => {
    expect(fitLaunchpadLogoDimensions(2048, 1024)).toEqual({
      width: 512,
      height: 256,
    })
    expect(fitLaunchpadLogoDimensions(256, 128)).toEqual({
      width: 256,
      height: 128,
    })
  })
})
