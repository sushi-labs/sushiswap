import { Navigation } from '@sushiswap/ui'
import { Metadata } from 'next'
<<<<<<< HEAD:apps/web/src/app/terms-of-service/layout.tsx
import { headerElements } from '../_common/header-elements'
=======
import { headerElements } from '../../(evm)/_common/header-elements'
>>>>>>> master:apps/web/src/app/(legal)/terms-of-service/layout.tsx

export const metadata: Metadata = {
  title: 'Terms Of Service',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation leftElements={headerElements()} />
      <div className="flex flex-col flex-1">{children}</div>
    </>
  )
}
