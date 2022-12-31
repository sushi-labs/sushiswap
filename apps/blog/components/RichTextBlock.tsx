import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { RichTextBlock as RichTextType } from 'types'

interface RichText {
  block: RichTextType
}

export const RichTextBlock: FC<RichText> = ({ block }) => {
  if (!block.body) return <></>
  return <ReactMarkdown>{block.body}</ReactMarkdown>
}
