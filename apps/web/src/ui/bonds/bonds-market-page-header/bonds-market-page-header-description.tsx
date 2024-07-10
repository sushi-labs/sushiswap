'use client'

import { Bond } from '@sushiswap/client'
import { useMemo, useState } from 'react'

export const BondsMarketPageHeaderDescription = ({ bond }: { bond: Bond }) => {
  if (!bond.description) {
    return null
  }

  if (bond.description.length < 200) {
    return (
      <div className="text-sm block text-justify">
        <span className="text-muted-foreground whitespace-pre-line">
          {bond.description}
        </span>
      </div>
    )
  }

  return <BondsMarketPageHeaderDescriptionLong description={bond.description} />
}

const BondsMarketPageHeaderDescriptionLong = ({
  description,
}: { description: string }) => {
  const [showAll, setShowAll] = useState(false)

  const text = useMemo(() => {
    if (showAll) return description

    const shortened = description.slice(0, 200)

    return `${shortened}...`
  }, [description, showAll])

  return (
    <div className="space-x-1 text-sm block text-justify">
      <span className="text-muted-foreground whitespace-pre-line">{text}</span>
      <button
        type="button"
        className="text-blue font-semibold"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? 'View Less' : 'View More'}
      </button>
    </div>
  )
}
