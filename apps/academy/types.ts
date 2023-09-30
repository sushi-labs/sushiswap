export type Article = {
  // id: string
  attributes: {
    authors: Data<Author[]>
    title: string
    description: string
    ghostSlug: string | null
    slug: string
    cover: Data<Image>
    products: Data<Product[]>
    topics: Data<Topic[]>
    difficulty: Data<Difficulty>
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export type Product = {
  id: string
  attributes: {
    name: string
    slug: string
  }
}

export type Topic = {
  attributes: {
    name: string
  }
}

export type Difficulty = {
  attributes: {
    name: string
    label: string
    slug: string
  }
} | null

export type Image = {
  // id: number
  attributes: {
    name: string
    alternativeText: string
    caption: string
    width: number | null
    height: number | null
    // hash: string
    // ext: string
    // mime: string
    // size: number
    url: string
    // previewUrl: string | null
    // provider: string
    provider_metadata: { public_id: string; resource_type: string }
    // createdAt: string
    // updatedAt: string
  }
}

export type Meta = {
  pagination: Pagination
}

export type Pagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export type Seo = {
  id: number
  metaDescription: string
  metaTitle: string
  shareImage: Data<Image>
  article: boolean
  slug: string
  tags: string[]
}

export type Author = {
  // id: number
  attributes: {
    avatar: Data<Image>
    name: string
    handle: string
    email: string
    // createdAt: string
    // updatedAt: string
  }
}

export type Data<T> = {
  data: T
  // meta: Meta
}

export type Collection<T> = {
  data: Array<T>
  meta: Meta
}
