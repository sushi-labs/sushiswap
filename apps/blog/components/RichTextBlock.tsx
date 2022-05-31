import { FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { RichTextBlock as RichTextblockType } from '../types'

interface RichText {
  block: RichTextblockType
}

export const RichTextBlock: FC<RichText> = ({ block }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ ...props }) => (
          <h1 {...props} className="text-slate-200 mb-5 text-3xl font-bold group flex whitespace-pre-wrap" />
        ),
        h2: ({ ...props }) => (
          <>
            <hr className="border border-slate-800/40 my-12" />
            <h2 {...props} className="text-slate-200 mb-4 text-2xl font-bold group flex whitespace-pre-wrap" />
          </>
        ),
        h3: ({ ...props }) => (
          <h3 {...props} className="text-slate-300 font-bold text-xl mb-3 mt-12 group flex whitespace-pre-wrap" />
        ),
        p: ({ ...props }) => (
          <p {...props} className="text-base max-w-3xl mx-auto mb-[1.25em] text-slate-400 leading-[28px]" />
        ),
        a: ({ ...props }) => <a {...props} className="text-slate-200 font-bold text-blue hover:text-blue-300" />,
      }}
    >
      {block.body}
    </ReactMarkdown>
  )
}
