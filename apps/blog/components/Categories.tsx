import { Button } from '@sushiswap/ui'
import { Dispatch, FC, SetStateAction, useCallback } from 'react'
import { Category } from 'types'

interface Categories {
  selected: string[]
  onSelect: Dispatch<SetStateAction<string[]>>
  categories: Category[]
}

export const Categories: FC<Categories> = ({ categories, selected, onSelect }) => {
  const handleSelect = useCallback(
    (index: string) => {
      onSelect((prevState: string[]) => {
        if (selected.includes(index)) return prevState.filter((el) => el !== index)
        else return [...prevState, index]
      })
    },
    [selected, onSelect]
  )

  return (
    <>
      {categories.map((category) => {
        if (!category?.id) return <></>

        return (
          <Button
            size="sm"
            color={selected.includes(category.id) ? 'blue' : 'gray'}
            onClick={() => handleSelect(category.id as string)}
            variant="outlined"
            key={category.id}
            className="!text-xs capitalize"
          >
            {category?.attributes?.name}
          </Button>
        )
      })}
    </>
  )
}
