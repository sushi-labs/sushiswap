export const gtagEvent = (...args: Gtag.GtagCommands['event']) =>
  typeof window.gtag !== 'undefined' && window.gtag('event', ...args)
