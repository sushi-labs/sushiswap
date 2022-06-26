import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { ComponentSharedRichText } from '../.graphclient'

interface RichText {
  block: ComponentSharedRichText
}

export const RichTextBlock: FC<RichText> = ({ block }) => {
  if (!block.body) return <></>
  return <ReactMarkdown>{block.body}</ReactMarkdown>
}
