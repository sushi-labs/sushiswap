/**
 * @typedef {import('mdast').Image} Image
 * @typedef {import('hast').Properties} Properties
 * @typedef {import('../index.js').Handler} Handler
 */

import normalize from 'mdurl/encode.js'

/**
 * @type {Handler}
 * @param {Image} node
 */
export function image(h, node) {
  /** @type {Properties} */
  const props = {src: normalize(node.url), alt: node.alt}

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  return h(node, 'img', props)
}
