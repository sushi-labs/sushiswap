import { AcademySearchProvider } from './components/academy-search-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AcademySearchProvider>{children}</AcademySearchProvider>
}
