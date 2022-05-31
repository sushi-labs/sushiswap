import { Button } from '@sushiswap/ui'
import { FC } from 'react'

import { Category } from '../types'

interface Categories {
  categories: Category[]
}

export const Categories: FC<Categories> = ({ categories }) => {
  return (
    <>
      {categories.map((category) => (
        <Button size="sm" color="blue" variant="outlined" key={category.id} className="capitalize">
          {category.attributes.name}
        </Button>
      ))}
    </>
  )
}
