import { Button } from '@sushiswap/ui'
import { Dispatch, FC, SetStateAction } from 'react'

import { CategoryEntity } from '../.mesh'

interface Categories {
  selected: string
  onSelect: Dispatch<SetStateAction<string>>
  categories: CategoryEntity[]
}

export const Categories: FC<Categories> = ({ categories, selected, onSelect }) => {
  return (
    <>
      {categories.map((category) => {
        if (!category?.id) return <></>

        return (
          <Button
            size="sm"
            color={selected === category.id ? 'blue' : 'gray'}
            onClick={() => onSelect(category.id)}
            variant="outlined"
            key={category.id}
            className="!text-xs rounded-full"
          >
            {category?.attributes?.name}
          </Button>
        )
      })}
    </>
  )
}
