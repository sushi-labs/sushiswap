import { Container } from '@sushiswap/ui'
import { Providers } from './providers'

export const metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Container
        maxWidth={'5xl'}
        className="flex justify-center lg:mx-auto px-4 h-full"
      >
        <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">
          <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
            {children}
          </div>
        </div>
      </Container>
    </Providers>
  )
}
