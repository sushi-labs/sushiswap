import { MavaScript } from 'src/app/_common/mava-script'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MavaScript />
      {children}
    </>
  )
}
