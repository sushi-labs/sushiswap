import React from 'react'

export const metadata = {
  title: 'Sushi 🍣',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}
