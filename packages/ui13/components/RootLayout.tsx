import React from 'react'

import { HEADER_HEIGHT } from '../constants'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <head />
      <body className="overflow-y-auto">
        {/*spacer*/}
        <div className="w-full" style={{ height: HEADER_HEIGHT }} />

        {children}
      </body>
    </html>
  )
}
