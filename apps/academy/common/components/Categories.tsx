import { Button, classNames } from '@sushiswap/ui'
import { Dispatch, FC, SetStateAction } from 'react'

import { CategoryEntity } from '../../.mesh'

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
            size="md"
            onClick={() => onSelect(category.id)}
            key={category.id}
            color="gray"
            className={classNames(
              '!px-[14px] sm:!px-4 !h-9 sm:h-10 font-medium !text-xs sm:!text-sm sm:font-normal rounded-full !bg-slate-800 hover:ring-1',
              selected === category.id && 'ring-1'
            )}
          >
            {category?.attributes?.name}
          </Button>
        )
      })}
    </>
  )
}
