import { getProducts, getTopics } from '@sushiswap/graph-client/strapi'
import { TopicProductSidebarClient } from './topic-product-sidebar-client'

export async function TopicProductSidebar() {
  const categories = await Promise.all([getTopics(), getProducts()])

  return (
    <div>
      <TopicProductSidebarClient categories={categories.flat()} />
    </div>
  )
}
