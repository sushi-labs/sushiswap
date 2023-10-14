import type { FC } from 'react'
import type { MediaBlock as MediaBlockType } from 'types'
import { Image } from './Image'

interface MediaBlock {
  block: MediaBlockType
}

export const MediaBlock: FC<MediaBlock> = ({ block }) => {
  return (
    <div className="flex flex-col gap-4 my-10">
      {block.file.data ? <div className="relative overflow-hidden rounded-xl">
          <Image
            className="overflow-hidden rounded-xl"
            image={block.file.data}
            layout="responsive"
            objectFit="contain"
          />
        </div> : null}
      {block.caption ? <span className="text-xs font-medium text-slate-400">
          {block.caption}
        </span> : null}
    </div>
  )
}
