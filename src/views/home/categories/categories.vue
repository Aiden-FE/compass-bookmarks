<script setup lang="ts">
import { deleteBookmark, deleteCategory, updateBookmark } from '~/http';
import { BookmarksStore } from '~/store';
import { useI18n } from 'vue-i18n';
import { Bookmark, Category } from '~/types';
import { message, Modal } from 'ant-design-vue';
import AppEditBookmark from './edit-bookmark.vue';
import AppEditCategory from './edit-category.vue';

const { t } = useI18n();
const { getCategories, getBookmarks } = BookmarksStore();
const {
  categories, activeCategories, bookmarks, uncategorizedBookmarks,
} = storeToRefs(BookmarksStore());
const bookmarkPanel = ref(false);
const editingBookmark = ref<Bookmark | null>(null);
const categoryPanel = ref(false);
const editingCategory = ref<Category | null>(null);
const isExpandAll = ref(true);
getBookmarks();
getCategories();

function openTarget(bookmark: any, outsideOpen = true) {
  updateBookmark(bookmark.id, {
    increaseHeat: 1,
  }).subscribe();
  window.open(bookmark.url, outsideOpen ? '_blank' : '_self');
}

function getImageFavicon(url: string) {
  return `${new URL(url).origin}/favicon.ico`;
}

function editCategory(category?: Category) {
  editingCategory.value = category || null;
  categoryPanel.value = true;
}

function editBookmark(bookmark?: Bookmark) {
  if (bookmark?.id) {
    editingBookmark.value = bookmarks.value
      .find((bookmarkData) => bookmarkData.id === bookmark.id)
      || null;
  }
  bookmarkPanel.value = true;
}

function removeCategory(category: Category) {
  Modal.confirm({
    title: '删除分类',
    content: '您确认删除分类吗?',
    onOk: () => {
      deleteCategory(category.id).subscribe(
        () => {
          message.success('删除成功');
          getBookmarks();
          getCategories();
        },
      );
    },
    okText: '确认',
    cancelText: '取消',
  });
}

function removeBookmark(bookmark: Bookmark) {
  Modal.confirm({
    title: '删除书签',
    content: '您确认删除书签吗?',
    onOk: () => {
      deleteBookmark(bookmark.id).subscribe(
        () => {
          message.success('删除成功');
          getBookmarks();
          getCategories();
        },
      );
    },
    okText: '确认',
    cancelText: '取消',
  });
}

function bookmarkPanelClose() {
  editingBookmark.value = null;
}

function categoryPanelClose() {
  editingCategory.value = null;
}

function toggleExpand(isExp: boolean) {
  if (isExp) {
    activeCategories.value = categories.value.map((category) => category.id).concat(-1);
  } else {
    activeCategories.value = [];
  }
}
</script>

<template>
  <div class="cp-home-categories__header !mx-40 flex px-16px items-center">
    <div class="flex-1">
      <a-button
        class="mr-3"
        type="primary"
        @click="editCategory()"
      >
        新建分类
      </a-button>
      <a-button
        @click="editBookmark()"
      >
        新建书签
      </a-button>
    </div>
    <a-switch
      v-model:checked="isExpandAll"
      checked-children="展开全部分类"
      un-checked-children="收起全部分类"
      @change="toggleExpand"
    />
  </div>
  <a-collapse
    class="cp-home-categories !px-40 !my-16px"
    v-model:activeKey="activeCategories"
    expand-icon-position="right"
    ghost
  >
    <a-collapse-panel
      v-for="item in categories"
      :key="item.id"
      :header="`${item.name} (${item.bookmarks?.length || 0})`"
    >
      <template #extra>
        <a-dropdown v-if="item.id !== 0">
          <i-ant-design-more-outlined
            class="relative top-3px"
            @click.prevent
          />
          <template #overlay>
            <a-menu>
              <a-menu-item key="edit">
                <a-button
                  @click="editCategory(item)"
                  type="link"
                >
                  修改
                </a-button>
              </a-menu-item>
              <a-menu-item key="delete">
                <a-button
                  type="link"
                  @click="removeCategory(item)"
                >
                  删除
                </a-button>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <a-row
        justify="center"
        :gutter="[16, 16]"
      >
        <a-col
          v-for="bookmark in item.bookmarks"
          :key="bookmark.id"
          :span="5"
        >
          <a-card
            @click="openTarget(bookmark)"
            hoverable
          >
            <template #title>
              <a-avatar
                :alt="bookmark.name"
                :src="getImageFavicon(bookmark.url)"
              />
              <a-tooltip>
                <template #title>
                  {{ bookmark.name }}
                </template>
                {{ bookmark.name }}
              </a-tooltip>
            </template>
            <template #extra>
              <a-dropdown>
                <i-ant-design-more-outlined @click.prevent />
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="edit">
                      <a-button
                        @click="editBookmark(bookmark)"
                        type="link"
                      >
                        修改
                      </a-button>
                    </a-menu-item>
                    <a-menu-item key="delete">
                      <a-button
                        type="link"
                        @click="removeBookmark(bookmark)"
                      >
                        删除
                      </a-button>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <div class="h-80px">
              <p v-if="bookmark.description">
                {{ bookmark.description }}
              </p>
              <p
                v-else
                class="cp-home-categories__card_placeholder"
              >
                {{ t('noDescriptionAdded') }}
              </p>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-collapse-panel>
    <a-collapse-panel
      v-if="uncategorizedBookmarks?.length"
      :key="-1"
      :header="`未分类书签 (${uncategorizedBookmarks.length})`"
    >
      <a-row
        justify="center"
        :gutter="[16, 16]"
      >
        <a-col
          v-for="bookmark in uncategorizedBookmarks"
          :key="bookmark.id"
          :span="5"
        >
          <a-card
            @click="openTarget(bookmark)"
            hoverable
          >
            <template #title>
              <a-avatar
                :alt="bookmark.name"
                :src="getImageFavicon(bookmark.url)"
              />
              <a-tooltip>
                <template #title>
                  {{ bookmark.name }}
                </template>
                {{ bookmark.name }}
              </a-tooltip>
            </template>
            <template #extra>
              <a-dropdown>
                <i-ant-design-more-outlined @click.prevent />
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="edit">
                      <a-button
                        @click="editBookmark(bookmark)"
                        type="link"
                      >
                        修改
                      </a-button>
                    </a-menu-item>
                    <a-menu-item key="delete">
                      <a-button
                        type="link"
                        @click="removeBookmark(bookmark)"
                      >
                        删除
                      </a-button>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <div class="h-80px">
              <p v-if="bookmark.description">
                {{ bookmark.description }}
              </p>
              <p
                v-else
                class="cp-home-categories__card_placeholder"
              >
                {{ t('noDescriptionAdded') }}
              </p>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-collapse-panel>
  </a-collapse>
  <AppEditBookmark
    v-model:visible="bookmarkPanel"
    :bookmark="editingBookmark"
    :categories="categories"
    @close="bookmarkPanelClose"
  />
  <AppEditCategory
    v-model:visible="categoryPanel"
    :category="editingCategory"
    @close="categoryPanelClose"
  />
</template>

<style lang="stylus">
+block(home-categories)
  .ant-collapse-header
    background-color #fff
  .ant-collapse-item
    border-bottom: 1px solid #d9d9d9
  .ant-collapse-item.ant-collapse-item-active
    border-bottom: 0
</style>

<style scoped lang="stylus">
+block(home-categories)
  +element(header)
    height 46px
    background-color #fff
  +element(card)
    +modifier(placeholder)
      color #ccc
</style>
