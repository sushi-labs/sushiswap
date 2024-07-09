import { Suspense } from 'react'
import { BlogSearchProvider } from './components/blog-search-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <BlogSearchProvider>{children}</BlogSearchProvider>
    </Suspense>
  )
}
