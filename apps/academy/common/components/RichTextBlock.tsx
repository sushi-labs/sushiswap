import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { ComponentSharedRichText } from '../../.mesh'

interface RichText {
  block: ComponentSharedRichText
}

export const RichTextBlock: FC<RichText> = ({ block }) => {
  if (!block.key || !block.body) return <></>
  return (
    <div id={block.key}>
      <ReactMarkdown>{block.body}</ReactMarkdown>
    </div>
  )
}
