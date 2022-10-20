/**
 * @param {H} h
 */
export function footer(h: H): {
  type: string
  tagName: string
  properties: {
    dataFootnotes: boolean
    className: string[]
  }
  children: (
    | {
        type: string
        tagName: string
        properties: {
          id: string
          className: string[]
        }
        children: {
          type: 'text'
          value: string
        }[]
        value?: undefined
      }
    | {
        type: string
        value: string
        tagName?: undefined
        properties?: undefined
        children?: undefined
      }
    | {
        type: string
        tagName: string
        properties: {
          id?: undefined
          className?: undefined
        }
        children: import('hast').ElementContent[]
        value?: undefined
      }
  )[]
} | null
export type BlockContent = import('mdast').BlockContent
export type FootnoteDefinition = import('mdast').FootnoteDefinition
export type Element = import('hast').Element
export type ElementContent = import('hast').ElementContent
export type H = import('./index.js').H
