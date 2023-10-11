import { Toggle } from '@sushiswap/ui/components/toggle'
import { Dispatch, FC, SetStateAction, useCallback } from 'react'
import { Category } from 'types'

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
        else return [...prevState, index]
      })
    },
    [selected, onSelect],
  )

  return (
    <>
      {categories.map((category) => {
        if (!category?.id) return <></>

        return (
          <Toggle
            pressed={Boolean(selected.includes(category.id))}
            onPressedChange={() => handleSelect(category.id as string)}
            key={category.id}
          >
            {category?.attributes?.name}
          </Toggle>
        )
      })}
    </>
  )
}
