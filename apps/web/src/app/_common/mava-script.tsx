'use client'

import Script from 'next/script'

export function MavaScript() {
  return (
    <Script
      defer
      strategy="lazyOnload"
      src="https://widget.mava.app"
      widget-version="v2"
      id="MavaWebChat"
      enable-sdk="false"
      data-token="0126227a207d845923cd0e316108e824126a288d0beb5c378d2ed512f1e9a878"
    />
  )
}
