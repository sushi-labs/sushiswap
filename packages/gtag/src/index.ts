// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  window.gtag('config', 'G-JW8KWJ48EF', {
    page_path: url,
  })
}

type GTagEvent = {
  action: string
  category: string
  label?: string
  value?: unknown
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
