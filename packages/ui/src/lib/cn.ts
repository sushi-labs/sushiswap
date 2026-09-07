import { extendTailwindMerge } from 'tailwind-merge'

/**
 * `classNames` concatenates; it does not resolve conflicts. When a caller's
 * class and a component's base class both set the same property, the winner is
 * decided by the order Tailwind emitted them in the stylesheet, which is not
 * visible from the call site. `cn` resolves those conflicts so the last
 * argument wins — so always pass the caller's `className` last:
 *
 *     cn(buttonVariants({ variant, size }), className)
 *
 * Two groups need teaching, because `index.css` hand-writes classes that look
 * like utilities but are not, and tailwind-merge can only guess from the name:
 *
 * - `border-sushi-gradient` is a ::before gradient border, not a border colour.
 *   Left to itself tailwind-merge files it under border-color and drops it the
 *   moment a caller passes any `border-*`.
 * - The custom `backgroundImage` keys read as background *colours* by name, so
 *   they would be dropped by a real `bg-<color>` that they should coexist with.
 *
 * `bg-sushi-gradient` is deliberately not listed: it sets the `background`
 * shorthand, so letting a caller's `bg-*` replace it is the correct behaviour.
 */
export const cn = extendTailwindMerge<'sushi-gradient-border'>({
  extend: {
    classGroups: {
      'bg-image': [
        'bg-gradient-radial',
        'bg-shimmer-gradient',
        'bg-shimmer-gradient-dark',
      ],
      'sushi-gradient-border': ['border-sushi-gradient'],
    },
  },
})
