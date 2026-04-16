import { perpCategories } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { hlHttpTransport } from '../transports'

export const usePerpCategories = () => {
  return useQuery({
    queryKey: ['usePerpCategories'],
    queryFn: async () => {
      const data = await perpCategories({
        transport: hlHttpTransport,
      })
      const uniqueCategories = new Set<string>()
      data.forEach((category) => uniqueCategories.add(category[1]))
      const categoryMap = new Map<string, string[]>()
      data.forEach((category) => {
        const categoryName = category[1]
        const dexAsset = category[0]
        if (categoryMap.has(categoryName)) {
          categoryMap.get(categoryName)?.push(dexAsset)
        } else {
          categoryMap.set(categoryName, [dexAsset])
        }
      })
      return {
        data: categoryMap,
        uniqueCategories: Array.from(uniqueCategories),
      }
    },
  })
}
