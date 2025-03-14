import { SushiLabsIcon } from '@sushiswap/ui/icons/SushiLabsIcon'

interface Template {
  baseUrl: string
  code: string
}

export function Template({ baseUrl, code }: Template) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <style>
          {`body {
            font-family: 'Inter'
          }`}
        </style>
      </head>
      <body style={{ width: 640, padding: 30 }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <SushiLabsIcon width={24} height={24} />
          <span style={{ fontSize: '24px', fontWeight: 700, marginLeft: 12 }}>
            Sushi Labs
          </span>
        </div>
        <h1 style={{ fontSize: '24px', marginTop: 54, fontWeight: 500 }}>
          Verify your email
        </h1>
        <div style={{ fontWeight: 400 }}>
          <p style={{ marginTop: 24 }}>Hello,</p>
          <p style={{ marginTop: 24 }}>
            To complete your sign-in process and start exploring our developer
            tools, please click{' '}
            <a href={`${baseUrl}/portal/verify?code=${code}`}>this</a> link or
            use the code below to verify your email address.
          </p>
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 24,
              padding: 16,
              backgroundColor: '#F6F6F6',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            {code}
          </p>
          <div
            style={{
              marginTop: 24,
              backgroundColor: '#6F6F6F',
              width: '100%',
              height: 1,
            }}
          />
          <p style={{ marginTop: 24, fontSize: 14, color: '#6F6F6F' }}>
            If you didn't request this email, you can safely ignore it. If you
            encounter any issues, please contact us at{' '}
            <a href="mailto:support@sushi.com">support@sushi.com</a>
          </p>
        </div>
      </body>
    </html>
  )
}
