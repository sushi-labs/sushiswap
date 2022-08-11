import { FC } from 'react'

import { LendTableForSymbol } from './LendTableForSymbol'

export const LendSection: FC = () => {
  return (
    <section className="space-y-6">
      <LendTableForSymbol />
    </section>
  )
}
