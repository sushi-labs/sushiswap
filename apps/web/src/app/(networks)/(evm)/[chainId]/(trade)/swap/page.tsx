import { Container } from '@sushiswap/ui'
import { Suspense } from 'react'
import { DetailsInteractionTrackerProvider } from '../_ui/details-interaction-tracker-provider'
import { DerivedstateSimpleSwapProvider } from './_ui/derivedstate-simple-swap-provider'
import { SimpleSwapWidget } from './_ui/simple-swap-widget'
import { SimpleSwapWidgetFrame } from './_ui/simple-swap-widget-frame'
import { SimpleSwapWidgetSkeleton } from './_ui/simple-swap-widget-skeleton'
import { Providers } from './providers'

export default function SwapSimplePage() {
  return (
    <Container maxWidth="lg">
      <SimpleSwapWidgetFrame>
        <Suspense fallback={<SimpleSwapWidgetSkeleton />}>
          <Providers>
            <DerivedstateSimpleSwapProvider>
              <DetailsInteractionTrackerProvider>
                <SimpleSwapWidget />
              </DetailsInteractionTrackerProvider>
            </DerivedstateSimpleSwapProvider>
          </Providers>
        </Suspense>
      </SimpleSwapWidgetFrame>
    </Container>
  )
}
