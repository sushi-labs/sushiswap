import { Button, classNames } from '@sushiswap/ui'
import { Dispatch, FC, SetStateAction } from 'react'

import { TopicEntity } from '../../.mesh'

interface Topics {
  selected: string[]
  onSelect: Dispatch<SetStateAction<string>>
  topics: TopicEntity[]
}

export const Topics: FC<Topics> = ({ topics, selected, onSelect }) => {
  return (
    <>
      {topics.map((topic) => {
        const slug = topic.attributes?.slug
        if (!slug) return <></>

        return (
          <Button
            size="md"
            onClick={() => onSelect(slug)}
            key={slug}
            color="gray"
            className={classNames(
              '!px-[14px] sm:!px-4 !h-9 sm:h-10 font-medium !text-xs sm:!text-sm sm:font-normal rounded-full !bg-slate-800 hover:ring-1',
              selected.includes(slug) ? 'ring-1 focus:ring-1' : 'focus:ring-0 active:ring-1'
            )}
          >
            {topic?.attributes?.name}
          </Button>
        )
      })}
    </>
  )
}
