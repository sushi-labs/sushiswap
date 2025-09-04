import '@sushiswap/ui/index.css'

import {
  ArrowTopRightOnSquareIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid'
import { ToastContainer } from '@sushiswap/notifications'
import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@sushiswap/ui'
import { BrowserCookieIcon } from '@sushiswap/ui/icons/BrowserCookieIcon'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import { GithubIcon } from '@sushiswap/ui/icons/GithubIcon'
import { TwitterIcon } from '@sushiswap/ui/icons/TwitterIcon'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import type React from 'react'
import { CookieDialogContainer } from './_common/cookies/cookie-dialog-container'
import { Trackers } from './trackers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Sushi 🍣',
    template: '%s | Sushi 🍣',
  },
  description:
    'A Decentralised Finance (DeFi) app with features such as swap, cross chain swap, streaming, vesting, and permissionless market making for liquidity providers.',
  icons: {
    apple: '/apple-touch-icon.png?v=1',
    icon: '/favicon-32x-32.png?v=1',
    shortcut: '/favicon-16x-16.png?v=1',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://cdn.sushi.com/image/upload/v1731498183/sushi-assets/embed-web-visuals/default.jpg',
        width: 1920,
        height: 1080,
        alt: 'Sushi 🍣',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=1"
          color="#fa52a0"
        />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ToastContainer />
        <div className="fixed bottom-5 right-8 flex">
          <CookieDialogContainer>
            <IconButton
              size="sm"
              variant="ghost"
              icon={BrowserCookieIcon}
              name={'cookies'}
              className="text-muted-foreground"
            />
          </CookieDialogContainer>
          <Popover>
            <PopoverTrigger>
              <IconButton
                size="sm"
                variant="ghost"
                icon={QuestionMarkCircleIcon}
                name={'help'}
                className="text-muted-foreground"
              />
            </PopoverTrigger>
            <PopoverContent className="!p-0">
              <div className="px-5 py-4">Support</div>
              <Separator />
              <div className="px-5 py-4 flex flex-col gap-3">
                <a
                  href="/academy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm flex items-center gap-2"
                >
                  Sushi Academy
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
                <Separator />
                <a
                  href="/faq"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm flex items-center gap-2"
                >
                  FAQ
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
                <Separator />
                <span>Socials</span>
                <div className="flex gap-5">
                  <GithubIcon width={18} height={18} />
                  <DiscordIcon width={18} height={18} />
                  <TwitterIcon width={18} height={18} />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {children}
        <Trackers />
      </body>
    </html>
  )
}
