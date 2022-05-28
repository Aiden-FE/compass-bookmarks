import { createPinia } from 'pinia';

const store = createPinia();
export { default as userStore } from './user';
export { default as BookmarksStore } from './bookmarks'
export default store;
