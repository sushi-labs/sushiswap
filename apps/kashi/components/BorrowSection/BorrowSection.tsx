import { FC } from 'react'

import { BorrowTableForSymbol } from './BorrowTableForSymbol'

export const BorrowSection: FC = () => {
  return (
    <section className="space-y-6">
      <BorrowTableForSymbol />
    </section>
  )
}
