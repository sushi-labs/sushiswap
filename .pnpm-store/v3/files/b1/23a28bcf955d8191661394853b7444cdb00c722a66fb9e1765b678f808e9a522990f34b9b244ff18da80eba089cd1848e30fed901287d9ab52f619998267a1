/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 *
 * @callback AllowElement
 * @param {Element} element
 * @param {number} index
 * @param {Element|Root} parent
 * @returns {boolean|undefined}
 *
 * @typedef Options
 * @property {Array<string>} [allowedElements]
 * @property {Array<string>} [disallowedElements=[]]
 * @property {AllowElement} [allowElement]
 * @property {boolean} [unwrapDisallowed=false]
 */
/**
 * @type {import('unified').Plugin<[Options], Root>}
 */
export default function rehypeFilter(
  options: Options
):
  | void
  | import('unified').Transformer<import('hast').Root, import('hast').Root>
export type Node = import('unist').Node
export type Root = import('hast').Root
export type Element = import('hast').Element
export type AllowElement = (
  element: Element,
  index: number,
  parent: Element | Root
) => boolean | undefined
export type Options = {
  allowedElements?: string[] | undefined
  disallowedElements?: string[] | undefined
  allowElement?: AllowElement | undefined
  unwrapDisallowed?: boolean | undefined
}
