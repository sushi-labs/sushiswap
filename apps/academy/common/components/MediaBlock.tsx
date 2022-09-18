import { FC } from 'react'

import { ComponentSharedMedia } from '../../.mesh'
import { Image } from './Image'

interface MediaBlock {
  block: ComponentSharedMedia
}

export const MediaBlock: FC<MediaBlock> = ({ block }) => {
  return (
    <div className="flex flex-col gap-4 my-10">
      {block.file?.data && (
        <div className="relative overflow-hidden rounded-xl">
          <Image
            layout="responsive"
            objectFit="contain"
            image={block.file.data}
            className="overflow-hidden rounded-xl"
          />
        </div>
      )}
      {block.caption && <span className="text-xs font-medium text-slate-400">{block.caption}</span>}
    </div>
  )
}
