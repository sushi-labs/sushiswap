import { Dispatch, useEffect, useState } from 'react'

/*
  Currently expensive to render farm list item. The infinite scroll is used to
  to minimize this impact. This hook pairs with it, keeping track of visible
  items and passes this to <InfiniteScroll> component.
*/
// @ts-ignore TYPE NEEDS FIXING
export function useInfiniteScroll(items): [number, Dispatch<number>] {
  const [itemsDisplayed, setItemsDisplayed] = useState(10)
  useEffect(() => setItemsDisplayed(15), [items.length])
  return [itemsDisplayed, setItemsDisplayed]
}
