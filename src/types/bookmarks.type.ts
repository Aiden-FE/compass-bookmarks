export interface Bookmark {
  id: number
  name: string
  url: string
  description?: string
  categories?: number[]
}

export interface Category {
  id: number
  name: string
  scoped: 'bookmarks'
  description?: string
  parentId?: number
  bookmarks?: Bookmark[]
}
