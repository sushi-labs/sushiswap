import { Header } from '../header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-col h-full flex-1">{children}</div>
    </>
  )
}
