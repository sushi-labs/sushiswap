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
      data-token="13a77dff2927f04aff517c51da8b35e921d69ecd86b5879ce2a7e747c71a646b"
    />
  )
}
