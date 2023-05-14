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
      <main className="dark text-gray-50">
        <Hero />
        <Container maxWidth="6xl" className="mx-auto py-14 px-4">
          {children}
        </Container>
      </main>
    </>
  )
}
