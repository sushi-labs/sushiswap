/**
 * Visit children of tree which pass a test
 *
 * @param tree Abstract syntax tree to walk
 * @param test Test, optional
 * @param visitor Function to run for each node
 * @param reverse Fisit the tree in reverse, defaults to false
 */
export const visit: (<
  Tree extends import('unist').Node<import('unist').Data>,
  Check extends import('unist-util-is').Test
>(
  tree: Tree,
  test: Check,
  visitor: import('./complex-types').BuildVisitor<Tree, Check>,
  reverse?: boolean | undefined
) => void) &
  (<Tree_1 extends import('unist').Node<import('unist').Data>>(
    tree: Tree_1,
    visitor: import('./complex-types').BuildVisitor<Tree_1, string>,
    reverse?: boolean | undefined
  ) => void)
export type Node = import('unist').Node
export type Parent = import('unist').Parent
export type Test = import('unist-util-is').Test
export type VisitorResult = import('unist-util-visit-parents').VisitorResult
export type Visitor = import('./complex-types').Visitor
import {CONTINUE} from 'unist-util-visit-parents'
import {SKIP} from 'unist-util-visit-parents'
import {EXIT} from 'unist-util-visit-parents'
export {CONTINUE, SKIP, EXIT}
