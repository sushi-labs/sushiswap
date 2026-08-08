import { cacheLife } from 'next/cache'
import { getCategories } from 'src/app/(cms)/lib/strapi/categories'
import { CategoryFilterClient } from './category-filter-client'

export async function CategoryFilter() {
  'use cache'
  cacheLife({ revalidate: 3600 })

  const categories = await getCategories()

  return <CategoryFilterClient categories={categories} />
}
