import { Navigation } from '@sushiswap/ui'
import { headerElements } from '~evm/_common/header-elements'

export const fetchCache = 'default-no-store'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full h-[56px] z-20">
        <div className="fixed w-full flex z-20">
          <Navigation
            leftElements={headerElements({ includeOnramper: false })}
          />
        </div>
      </div>
      <div className="flex flex-col flex-1">{children}</div>
    </>
  )
}
