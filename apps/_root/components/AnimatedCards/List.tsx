import { FC } from 'react'

import { CardInterface } from '../data'
import { Card } from './Card'

export const List: FC<{ selectedId: string; onSelect(id: string): void; data: CardInterface[] }> = ({
  data,
  onSelect,
}) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 content-start gap-6">
      {data.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          title={card.title}
          category={card.category}
          pointOfInterest={card.pointOfInterest}
          icon={card.icon}
          backgroundColor={card.backgroundColor}
          textColor={card.textColor}
          onSelect={onSelect}
          audience={card.audience}
          content={card.content}
          link={card.link}
        />
      ))}
    </ul>
  )
}
