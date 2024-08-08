import { Navigation } from '@sushiswap/ui'
import { Metadata } from 'next'
<<<<<<< HEAD:apps/web/src/app/privacy-policy/layout.tsx
import { headerElements } from '../_common/header-elements'
=======
import { headerElements } from '../../(evm)/_common/header-elements'
>>>>>>> master:apps/web/src/app/(legal)/privacy-policy/layout.tsx

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation leftElements={headerElements()} />
      <div className="flex flex-col flex-1">{children}</div>
    </>
  )
}
