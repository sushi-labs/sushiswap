export const GOOGLE_ANALYTICS_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
// @ts-ignore TYPE NEEDS FIXING
export const pageview = (url) => {
  // @ts-ignore TYPE NEEDS FIXING
  window.gtag('config', GOOGLE_ANALYTICS_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
// @ts-ignore TYPE NEEDS FIXING
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/exceptions
// @ts-ignore TYPE NEEDS FIXING
export const exception = ({ description, fatal }) => {
  window.gtag('event', 'exception', {
    description,
    fatal,
  })
}
