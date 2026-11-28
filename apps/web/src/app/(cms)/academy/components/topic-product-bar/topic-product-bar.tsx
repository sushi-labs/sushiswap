import { getAcademyCategories } from '../../filter-options'
import { TopicProductBarClient } from './topic-product-bar-client'

export async function TopicProductBar() {
  const categories = await getAcademyCategories()

  return (
    <div>
      <TopicProductBarClient categories={categories} />
    </div>
  )
}
