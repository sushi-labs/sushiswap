import React from 'react'

import { HEADER_HEIGHT } from '../constants'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <head />
      <body className="overflow-y-scroll" style={{ marginTop: HEADER_HEIGHT }}>
        {children}
      </body>
    </html>
  )
}
