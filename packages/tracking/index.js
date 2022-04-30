export const TARGET_ID = process.env.TARGET_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  window.gtag('config', GOOGLE_ANALYTICS_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/exceptions
export const exception = ({ description, fatal }) => {
  window.gtag('event', 'exception', {
    description,
    fatal,
  })
}
