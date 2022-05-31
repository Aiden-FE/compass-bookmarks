import { Bookmark, Category } from '~/types';
import Http from './http';

export function getCategories(keyword?: string) {
  return Http.get('categories')
    .query({ keyword });
}

export function createCategory(data: Omit<Category, 'id' | 'bookmarks'>) {
  return Http.post('categories')
    .body(data);
}

export function deleteCategory(id: number) {
  return Http.delete(`categories/${id}`);
}

export function updateCategory(id: number, data: Partial<Omit<Category, 'id' | 'bookmarks' | 'scoped'>> & {increaseHeat?: number}) {
  return Http.put(`categories/${id}`)
    .body(data);
}

export function getBookmarks(keyword?: string) {
  return Http.get('bookmarks')
    .query({ keyword });
}

export function updateBookmark(id: number, data: Partial<Omit<Bookmark, 'id'>> & {increaseHeat?: number}) {
  return Http.put(`bookmarks/${id}`)
    .body(data);
}

export function createBookmark(data: Omit<Bookmark, 'id'>) {
  return Http.post('bookmarks')
    .body(data);
}

export function deleteBookmark(id: number) {
  return Http.delete(`bookmarks/${id}`);
}
