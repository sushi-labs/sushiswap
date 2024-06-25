import { Container, classNames } from '@sushiswap/ui'
import { DEFAULT_SIDE_PADDING } from 'src/app/(cms)/constants'
import { LooperBg } from '../assets/looper-bg'
import { DifficultyFilterDropdown } from './difficulty-filter-dropdown/difficulty-filter-dropdown'

export function ExplorePageHeader() {
  return (
    <section className="bg-slate-800 h-[113px] sm:h-[226px] relative">
      <Container
        maxWidth="6xl"
        className={classNames(
          DEFAULT_SIDE_PADDING,
          'flex items-center justify-between h-full mx-auto',
        )}
      >
        <div className="absolute bottom-0 right-0 opacity-20">
          <LooperBg className="sm:w-[570px] sm:h-[226px] h-[113px] w-[285px]" />
        </div>

        <div className="flex items-center justify-between h-full w-full z-10 gap-10">
          <div>
            <p className="text-sm sm:text-xl sm:font-medium">Articles</p>
            <p className="text-3xl sm:text-5xl sm:font-medium">
              Latest releases
            </p>
          </div>

          <DifficultyFilterDropdown />
        </div>
      </Container>
    </section>
  )
}
