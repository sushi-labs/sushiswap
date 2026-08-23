import { Container } from '@sushiswap/ui'
import { SimpleSwapWidgetFrame } from './_ui/simple-swap-widget-frame'
import { SimpleSwapWidgetSkeleton } from './_ui/simple-swap-widget-skeleton'

export default function SimpleSwapLoading() {
  return (
    <Container maxWidth="lg">
      <SimpleSwapWidgetFrame>
        <SimpleSwapWidgetSkeleton />
      </SimpleSwapWidgetFrame>
    </Container>
  )
}
