import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { CookieDialog } from './cookie-dialog'

const { segmentsMock } = vi.hoisted(() => ({
  segmentsMock: vi.fn((): string[] => []),
}))

vi.mock('next/navigation', () => ({
  useSelectedLayoutSegments: segmentsMock,
}))

describe('CookieDialog', () => {
  it('includes the initial consent banner in server-rendered HTML', () => {
    const html = renderToStaticMarkup(
      <CookieDialog defaultOpen>
        <button type="button">Manage cookies</button>
      </CookieDialog>,
    )

    expect(html).toContain('id="cookie-policy-title"')
    expect(html).toContain('Accept all cookies')
  })

  it('omits the consent banner when cookies are already confirmed', () => {
    const html = renderToStaticMarkup(
      <CookieDialog defaultOpen={false}>
        <button type="button">Manage cookies</button>
      </CookieDialog>,
    )

    expect(html).not.toContain('id="cookie-policy-title"')
    expect(html).toContain('Manage cookies')
  })

  it.each([{ segments: ['perps'] }, { segments: ['42161', 'launchpad'] }])(
    'uses perps styling for segments $segments',
    ({ segments }) => {
      segmentsMock.mockReturnValue(segments)

      const html = renderToStaticMarkup(
        <CookieDialog defaultOpen>
          <button type="button">Manage cookies</button>
        </CookieDialog>,
      )

      expect(html).toContain('bg-perps-background/95')
    },
  )
})
