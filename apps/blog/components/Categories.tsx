import { Toggle } from '@sushiswap/ui'
import { Category } from 'lib/strapi/categories'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useCallback } from 'react'

interface Categories {
  selected: string[]
  onSelect: Dispatch<SetStateAction<string[]>>
  categories: Category[]
}

export const Categories: FC<Categories> = ({
  categories,
  selected,
  onSelect,
}) => {
  const handleSelect = useCallback(
    (index: string) => {
      onSelect((prevState: string[]) => {
        if (selected.includes(index))
          return prevState.filter((el) => el !== index)
        return [...prevState, index]
      })
    },
    [selected, onSelect],
  )

  return (
    <>
      {categories.map((category) => {
        if (!category) return <></>

        return (
          <Toggle
            key={category.id}
            onPressedChange={() => {
              handleSelect(category.id.toString())
            }}
            pressed={Boolean(selected.includes(category.id.toString()))}
          >
            {category.name}
          </Toggle>
        )
      })}
    </>
  )
}
