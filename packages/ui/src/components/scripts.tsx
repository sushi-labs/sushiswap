'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export const GoogleAnalytics = ({ enabled }: { enabled: boolean }) => {
  if (!enabled) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={'https://www.googletagmanager.com/gtag/js?id=G-JW8KWJ48EF'}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JW8KWJ48EF', {
            page_path: window.location.pathname,
            cookie_flags: 'max-age=7200;secure;samesite=none'
          });
        `,
        }}
      />
    </>
  )
}

export const GoogleTagManager = ({ enabled }: { enabled: boolean }) => {
  if (!enabled) return null

  useEffect(() => {
    // Dynamically add <noscript> to the body
    const noscript = document.createElement('noscript')
    noscript.innerHTML = `
      <iframe
        title="Google Tag Manager"
        src="https://www.googletagmanager.com/ns.html?id=GTM-M24NNGHP"
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      ></iframe>
    `
    document.body.appendChild(noscript)

    return () => {
      // Cleanup to prevent duplicate noscript elements
      document.body.removeChild(noscript)
    }
  }, [])

  return (
    <Script
      id="google-tag-manager"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M24NNGHP');
        `,
      }}
    />
  )
}

export const HotJar = ({ enabled }: { enabled: boolean }) => {
  if (!enabled) return null

  return (
    <Script
      id="hotjar-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3553126,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `,
      }}
    />
  )
}
