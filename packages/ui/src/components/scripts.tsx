'use client'

import Script from 'next/script'

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
