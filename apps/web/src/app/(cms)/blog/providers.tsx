'use client'

import { BlogSearchProvider } from './components/blog-search-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <BlogSearchProvider>{children}</BlogSearchProvider>
}
