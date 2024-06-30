import { getCategories } from 'src/app/(cms)/lib/strapi/categories'
import { CategoryFilterClient } from './category-filter-client'

export const revalidate = 3600

export async function CategoryFilter() {
  const categories = await getCategories()

  return <CategoryFilterClient categories={categories} />
}
