import NextImage from 'next/legacy/image'

import { Container } from '@sushiswap/ui'
import background from './assets/background.png'
import { Hero } from './components/hero'
import { SearchBox } from './components/search-box'

export default async function Page() {
  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <NextImage
          className="-z-[1]"
          layout="responsive"
          src={background}
          alt="Academy Background"
          priority
          unoptimized
        />
      </div>
      <Container maxWidth="6xl" className="pb-16 mx-auto sm:pb-24">
        <Hero />
        <div className="flex justify-center">
          <div className="w-2/3">
            <SearchBox />
          </div>
        </div>
      </Container>
    </div>
  )
}
