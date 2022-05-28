import { getBookmarks, getCategories } from '~/http';

export default defineStore('bookmarks', {
  state: () => ({
    categories: [{
      id: 0,
      name: '常用',
      bookmarks: [],
    }],
    activeCategories: [] as number[],
  }),
  actions: {
    getBookmarks(keyword?: string) {
      getBookmarks(keyword).subscribe((result) => {
        this.categories[0].bookmarks = result.result.slice(0, 20);
      });
    },
    getCategories() {
      getCategories().subscribe((result) => {
        this.categories = [this.categories[0]].concat(result.result);
        this.activeCategories = this.categories.map((category) => category.id);
      });
    },
  },
});
