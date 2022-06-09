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
        <div className="relative overflow-hidden rounded-xl">
          <Image layout="responsive" objectFit="contain" image={block.file} className="rounded-xl overflow-hidden" />
        </div>
      )}
      {block.caption && <span className="text-xs font-bold text-slate-400">{block.caption}</span>}
    </div>
  )
}
