import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CookieDialog } from './cookie-dialog'

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
})
