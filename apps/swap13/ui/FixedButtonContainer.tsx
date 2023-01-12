import Container from '@sushiswap/ui13/components/Container'
import { FC, ReactNode } from 'react'

export const FixedButtonContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="fixed z-10 bottom-4 sm:bottom-6 sm:p-4 !pb-0 left-4 right-4 w-[unset] sm:!mr-[var(--scroll-lock-safe-area)]">
      <Container maxWidth={520} className="mx-auto flex flex-col gap-4">
        {children}
      </Container>
    </div>
  )
}
