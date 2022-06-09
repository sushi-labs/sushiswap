import { FC } from 'react'

import { MediaBlock as MediaBlockType } from '../types'
import { Image } from './Image'

interface MediaBlock {
  block: MediaBlockType
}

export const MediaBlock: FC<MediaBlock> = ({ block }) => {
  return (
    <div className="flex flex-col gap-4 my-10">
      {block.file && (
        <div className="relative rounded-xl overflow-hidden">
          <Image layout="responsive" objectFit="contain" image={block.file} />
        </div>
      )}
      {block.caption && <span className="text-xs text-slate-400 font-bold">{block.caption}</span>}
    </div>
  )
}
