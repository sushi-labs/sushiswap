// syncScrollLockSafeArea.ts
const SCROLL_LOCK_SAFE_AREA = '--scroll-lock-safe-area'

// When opening, Dialog component sets `padding-right` value of scrollbar width to <html /> element
// `syncScrollLockSafeAreaCallback` function syncs this value with
// css custom property `SСROLL_LOCK_SAFE_AREA`
// for using the value in client code
// Issue: https://github.com/tailwindlabs/headlessui/issues/1804
export function syncScrollLockSafeArea() {
  const htmlElement = document.documentElement

  const observer = new MutationObserver(() => {
    const htmlStyle = document.documentElement.style

    if (
      htmlStyle.getPropertyValue(SCROLL_LOCK_SAFE_AREA) !==
      htmlStyle.paddingRight
    )
      htmlStyle.setProperty(SCROLL_LOCK_SAFE_AREA, htmlStyle.paddingRight)
  })

  observer.observe(htmlElement, {
    attributes: true,
    attributeOldValue: false,
    attributeFilter: ['style'],
  })

  return () => observer.disconnect()
}
