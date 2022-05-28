<script setup lang="ts">
import { updateBookmark } from '~/http';
import { BookmarksStore } from '~/store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { getCategories, getBookmarks } = BookmarksStore();
const { categories, activeCategories } = storeToRefs(BookmarksStore());

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
</script>

<template>
  <a-collapse
    class="cp-home-categories !px-40 !my-16px"
    v-model:activeKey="activeCategories"
    expand-icon-position="right"
    ghost
  >
    <a-collapse-panel
      v-for="item in categories"
      :key="item.id"
      :header="item.name"
    >
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
              <a href="#">more</a>
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
</template>

<style lang="stylus">
  .ant-collapse-header
    background-color #fff
</style>

<style scoped lang="stylus">
+block(home-categories)
  +element(card)
    +modifier(placeholder)
      color #ccc
</style>
