'use client'

import '@sushiswap/ui/index.css'
import '../variables.css'

import { ThemeProvider } from '@sushiswap/ui'
import Head from 'next/head'

import React from 'react'

import { Onramper } from '@sushiswap/wagmi/future/components'
import { WagmiConfig } from '../components/WagmiConfig'
import { QueryClientProvider } from '../components/QueryClientProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark" lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
      </Head>
      <body className="h-screen">
        <WagmiConfig>
          <QueryClientProvider>
            <ThemeProvider>
              <Onramper.Provider>{children}</Onramper.Provider>
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
