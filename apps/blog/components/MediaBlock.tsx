import { FC } from 'react'

import { MediaBlock as MediaBlockType } from '../types'
import { Image } from './Image'

interface MediaBlock {
  block: MediaBlockType
}

export const MediaBlock: FC<MediaBlock> = ({ block }) => {
  console.log(block)
  return (
    <div className="flex flex-col gap-4 my-10">
      <div className="rounded-xl overflow-hidden">
        <Image image={block.file} />
      </div>
      <div className="text-xs text-slate-400 font-bold">{block.caption}</div>
    </div>
  )
}
