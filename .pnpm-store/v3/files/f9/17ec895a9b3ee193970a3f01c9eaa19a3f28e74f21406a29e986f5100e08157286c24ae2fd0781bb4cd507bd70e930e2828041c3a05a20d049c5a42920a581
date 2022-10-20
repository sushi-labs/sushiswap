/**
 * Continue traversing as normal
 */
export const CONTINUE: true
/**
 * Do not traverse this node’s children
 */
export const SKIP: 'skip'
/**
 * Stop traversing immediately
 */
export const EXIT: false
/**
 * Visit children of tree which pass a test
 *
 * @param tree Abstract syntax tree to walk
 * @param test Test node, optional
 * @param visitor Function to run for each node
 * @param reverse Visit the tree in reverse order, defaults to false
 */
export const visitParents: (<
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
export type Action = import('./complex-types').Action
export type Index = import('./complex-types').Index
export type ActionTuple = import('./complex-types').ActionTuple
export type VisitorResult = import('./complex-types').VisitorResult
export type Visitor = import('./complex-types').Visitor
