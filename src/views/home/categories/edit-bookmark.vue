<script setup lang="ts">
import { CompassForm, CompassFormSchema, CompassFormSelectFieldDto } from '~/components/common';
import { DESC_MAX_LIMIT, TITLE_MAX_LIMIT, TITLE_MIN_LIMIT } from '~/config';
import { urlValidator } from '~/utils';
import { Bookmark, Category } from '~/types';
import { createBookmark, updateBookmark } from '~/http';
import { message } from 'ant-design-vue';
import { BookmarksStore } from '~/store';
import { debounce } from 'lodash-es';

const { getBookmarks, getCategories } = BookmarksStore();
const props = defineProps<{
  visible: boolean
  bookmark?: Bookmark | null
  categories?: Category[]
}>();
const propRefs = toRefs(props);
// eslint-disable-next-line no-unused-vars
const emits = defineEmits<{(event: 'update:visible', val: boolean): void
  // eslint-disable-next-line no-unused-vars
  (event: 'close'): void
}>();

const bookmarkForm = ref();
const formSchema = reactive(new CompassFormSchema<Bookmark>({
  model: {},
  labelCol: { span: 6 },
  labelAlign: 'left',
  items: [{
    fieldType: 'input',
    name: 'name',
    label: '名称',
    placeholder: '请输入书签名称',
  }, {
    fieldType: 'input',
    name: 'url',
    label: '链接地址',
    placeholder: '请输入链接地址',
  }, {
    fieldType: 'select',
    mode: 'multiple',
    name: 'categories',
    label: '所属分类',
    placeholder: '请选择书签所属分类',
    options: [],
    notFoundContent: '请先创建分类',
  }, {
    fieldType: 'input',
    name: 'description',
    label: '描述',
    placeholder: '请输入书签的相关描述',
  }],
  rules: {
    name: [{
      required: true,
      message: '请输入书签名称',
    }, {
      max: TITLE_MAX_LIMIT,
      min: TITLE_MIN_LIMIT,
      message: `请输入${TITLE_MIN_LIMIT}~${TITLE_MAX_LIMIT}长度的书签名称`,
    }],
    url: [{
      required: true,
      validator: urlValidator,
    }],
    description: [{
      max: DESC_MAX_LIMIT,
      message: `描述内容长度应该小于${DESC_MAX_LIMIT}`,
    }],
  },
}));

watch(propRefs.bookmark as unknown as Bookmark, (val) => {
  formSchema.model = {...val} as unknown as Bookmark;
});
watchEffect(() => {
  if (!propRefs.categories?.value || !propRefs.categories.value.length) return;
  const item = formSchema.items?.find((i) => i.name === 'categories' && i.fieldType === 'select') as CompassFormSelectFieldDto;
  item.options = (propRefs.categories.value as Category[])
    .filter((category) => category.id !== 0)
    .map((category) => ({
      label: category.name,
      value: category.id,
    }));
});

function close() {
  emits('update:visible', false);
  emits('close');
  bookmarkForm.value?.resetFields();
}

const submit = debounce(async () => {
  const valid = await bookmarkForm.value?.validateFields();
  if (!valid) return;
  const params = {
    name: formSchema.model.name,
    url: formSchema.model.url,
    description: formSchema.model.description,
    categories: formSchema.model.categories || [],
  };
  if (!propRefs.bookmark?.value) {
    createBookmark(params).subscribe(
      () => {
        getBookmarks();
        getCategories();
        message.success('创建成功');
        close();
      },
    );
    return;
  }
  updateBookmark(formSchema.model.id, params).subscribe(
    () => {
      getBookmarks();
      getCategories();
      message.success('更新成功');
      close();
    },
  );
}, 200);
</script>

<template>
  <a-modal
    :visible="visible"
    :title="bookmark ? '修改书签' : '新增书签'"
    width="400px"
    ok-text="确 定"
    cancel-text="取 消"
    @ok="submit"
    @cancel="close"
  >
    <CompassForm
      ref="bookmarkForm"
      :schema="formSchema"
    />
  </a-modal>
</template>
