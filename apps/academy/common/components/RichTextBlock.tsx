import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { ComponentSharedRichText } from '../../.mesh'

interface RichText {
  block: ComponentSharedRichText
}

export const RichTextBlock: FC<RichText> = ({ block }) => {
  if (!block.body) return <></>
  return (
    <p id={block.key}>
      <ReactMarkdown>{block.body}</ReactMarkdown>
    </p>
  )
}
