import { Suspense } from 'react'
import { AcademySearchProvider } from './components/academy-search-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AcademySearchProvider>{children}</AcademySearchProvider>
    </Suspense>
  )
}
