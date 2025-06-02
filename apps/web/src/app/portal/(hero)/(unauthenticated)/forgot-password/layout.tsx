import { Container } from '@sushiswap/ui'
import { BackButton } from 'src/app/portal/_common/ui/back-button'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackButton className="absolute top-0" />
      <Container maxWidth="md">{children}</Container>
    </>
  )
}
