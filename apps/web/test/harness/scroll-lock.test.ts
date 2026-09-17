import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const css = readFileSync(
  new URL('../../../../packages/ui/index.css', import.meta.url),
  'utf8',
)
  .replace(/^@import.*$/gm, '')
  .replace(/^@tailwind.*$/gm, '')

for (const width of [1280, 390]) {
  for (const scrollbarWidth of [16, 0]) {
    test(`scroll locks preserve layout at ${width}px with a ${scrollbarWidth}px scrollbar`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 720 })
      await page.setContent(`
        <style>${css}
          #page { min-height: 200vh; background: #151619; }
          #header { position: fixed; width: 100%; height: 56px; }
          #content { max-width: 800px; margin: auto; padding-top: 100px; }
          ::-webkit-scrollbar { width: ${scrollbarWidth}px; }
        </style>
        <div id="page"><header id="header">Launchpad</header><main id="content">Tokens</main></div>
      `)
      const bounds = () =>
        page.evaluate(() =>
          ['body', '#page', '#header', '#content'].map((selector) => {
            const rect = document
              .querySelector(selector)!
              .getBoundingClientRect()
            return { x: rect.x, width: rect.width }
          }),
        )
      const before = await bounds()
      // Reproduce react-remove-scroll's injected rule, including classic
      // scrollbar compensation even when headless Chrome uses overlay scrollbars.
      await page.addStyleTag({
        content: `body[data-scroll-locked] {
        overflow: hidden !important;
        margin-right: ${scrollbarWidth}px !important;
      }`,
      })
      for (const count of [1, 2, 1, 0]) {
        await page.evaluate((count) => {
          if (count)
            document.body.setAttribute('data-scroll-locked', String(count))
          else document.body.removeAttribute('data-scroll-locked')
        }, count)
        await expect.poll(bounds).toEqual(before)
        if (count) {
          expect(
            await page.evaluate(() => getComputedStyle(document.body).overflow),
          ).toBe('hidden')
        }
      }
    })
  }
}
