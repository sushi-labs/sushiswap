export type Article = {
  id: number
  attributes: {
    authors: {
      data: Author[]
    }
    title: string
    description: string
    slug: string
    cover: {
      data: Image
    }
    category: {
      data: Category
    }
    createdAt: string
    updatedAt: string
    publishedAt: string
    blocks: Block[]
  }
}

export type RichTextBlock = {
  id: number
  body: string
  __component: 'shared.rich-text'
}

export type MediaBlock = {
  id: number
  caption: string
  __component: 'shared.media'
  file: {
    data: Image
  }
}

export type Block = RichTextBlock | MediaBlock

export type Category = {
  id: number
  attributes: {
    description: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
  }
}

export type Image = {
  id: number
  attributes: {
    name: string
    alternativeText: string
    caption: string
    width: number
    height: number
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: string | null
    provider: string
    provider_metadata: string | null
    createdAt: string
    updatedAt: string
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
  shareImage: {
    data: Image
  }
  article: boolean
}

export type Author = {
  id: number
  attributes: {
    avatar: {
      data: Image
    }
    name: string
    handle: string
    createdAt: string
    updatedAt: string
  }
}
