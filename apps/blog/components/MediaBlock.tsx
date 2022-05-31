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
        <div className="rounded-xl overflow-hidden">
          <Image image={block.file} />
        </div>
      )}
      {block.caption && <div className="text-xs text-slate-400 font-bold">{block.caption}</div>}
    </div>
  )
}
