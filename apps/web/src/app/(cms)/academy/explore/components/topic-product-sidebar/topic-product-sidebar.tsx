import { getAcademyCategories } from '../../../filter-options'
import { TopicProductSidebarClient } from './topic-product-sidebar-client'

export async function TopicProductSidebar() {
  const categories = await getAcademyCategories()

  return (
    <div>
      <TopicProductSidebarClient categories={categories} />
    </div>
  )
}
