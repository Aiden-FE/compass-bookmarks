import { getBookmarks, getCategories } from '~/http';
import {Bookmark, Category} from "~/types";

export default defineStore('bookmarks', {
  state: () => ({
    categories: [{
      id: 0,
      name: '常用',
      scoped: 'bookmarks',
      bookmarks: [],
    }] as Category[],
    bookmarks: [] as Bookmark[],
    activeCategories: [] as number[],
  }),
  actions: {
    getBookmarks(keyword?: string) {
      getBookmarks(keyword).subscribe((result) => {
        this.categories[0].bookmarks = result.result.slice(0, 20);
        this.bookmarks = result.result
      });
    },
    getCategories(keyword?: string) {
      getCategories(keyword).subscribe((result) => {
        this.categories = [this.categories[0]].concat(result.result);
        this.activeCategories = this.categories.map((category) => category.id);
      });
    },
  },
});
