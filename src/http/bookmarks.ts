import Http from './http';

export function getCategories(keyword?: string) {
  return Http.get('categories')
    .query({ keyword });
}

export function getBookmarks (keyword?: string) {
  return Http.get('bookmarks')
    .query({keyword})
}

export function updateBookmark (id: number, data: any) {
  return Http.put(`bookmarks/${id}`)
    .body(data)
}
