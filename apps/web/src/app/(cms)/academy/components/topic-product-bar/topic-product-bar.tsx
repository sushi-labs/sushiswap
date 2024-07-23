import { getProducts, getTopics } from '@sushiswap/graph-client/strapi'
import { TopicProductBarClient } from './topic-product-bar-client'

export async function TopicProductBar() {
  const categories = await Promise.all([getTopics(), getProducts()])

  return (
    <div>
      <TopicProductBarClient categories={categories.flat()} />
    </div>
  )
}
