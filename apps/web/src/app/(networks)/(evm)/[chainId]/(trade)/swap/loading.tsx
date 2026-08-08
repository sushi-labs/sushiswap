import { Container } from '@sushiswap/ui'
import { SimpleSwapWidgetSkeleton } from './_ui/simple-swap-widget-skeleton'

export default function SimpleSwapLoading() {
  return (
    <Container maxWidth="lg">
      <SimpleSwapWidgetSkeleton />
    </Container>
  )
}
