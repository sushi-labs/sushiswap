import {
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from '@sushiswap/ui'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Container maxWidth="5xl" className="px-4">
      <CardHeader className="!p-0">
        <CardTitle>Available Strategies</CardTitle>
        <CardDescription>
          Choose one of the following strategies:
        </CardDescription>
      </CardHeader>
      {children}
    </Container>
  )
}
