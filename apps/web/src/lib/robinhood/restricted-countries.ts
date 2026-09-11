// https://docs.robinhood.com/rhj/restricted-jurisdictions
// Last checked: 2026-09-10. ISO 3166-1 alpha-2 country codes.
export const ROBINHOOD_STOCK_TOKEN_RESTRICTED_COUNTRIES: ReadonlySet<string> =
  new Set([
    'US', // United States
    'CA', // Canada
    'GB', // United Kingdom
    'CH', // Switzerland
    'CU', // Cuba
    'BY', // Belarus
    'IR', // Iran
    'KP', // North Korea
    'RU', // Russia
    'SY', // Syria
    'UA', // Ukraine
    'SS', // South Sudan
    'SD', // Sudan
    'MM', // Myanmar
    'VE', // Venezuela
  ])
