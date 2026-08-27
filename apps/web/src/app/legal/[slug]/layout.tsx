'use client'

import { Suspense } from 'react'
import { Header } from '../header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>
        <div className="flex flex-col flex-1">{children}</div>
      </Suspense>
    </>
  )
}
