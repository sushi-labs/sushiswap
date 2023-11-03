import { Toggle } from '@sushiswap/ui/components/toggle'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useCallback } from 'react'
import type { Category } from 'types'

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
        if (!category.id) return <></>

        return (
          <Toggle
            key={category.id}
            onPressedChange={() => {
              handleSelect(category.id)
            }}
            pressed={Boolean(selected.includes(category.id))}
          >
            {category.attributes.name}
          </Toggle>
        )
      })}
    </>
  )
}
