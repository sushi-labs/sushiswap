'use client'

import { AcademySearchProvider } from './components/academy-search-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AcademySearchProvider>{children}</AcademySearchProvider>
}
