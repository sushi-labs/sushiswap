import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { ComponentSharedRichText } from '../../.mesh'

interface RichText {
  block: ComponentSharedRichText
}

export const RichTextBlock: FC<RichText> = ({ block }) => {
  if (!block.body) return <></>

  return (
    <div>
      <ReactMarkdown>{block.body}</ReactMarkdown>
    </div>
  )
}
