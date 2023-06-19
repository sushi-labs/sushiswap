import React from 'react'

import { Header, Container, Hero } from './components'

export default function GovernanceDashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="dark:text-gray-50 text-[#101728]">
        <Hero />
        <Container maxWidth="6xl" className="mx-auto px-4 py-8 md:py-14">
          {children}
        </Container>
      </main>
    </>
  )
}
