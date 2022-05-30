<script setup lang="ts">
import { CompassForm, CompassFormSchema } from '~/components/common';
import { Category } from '~/types';
import { DESC_MAX_LIMIT, TITLE_MAX_LIMIT, TITLE_MIN_LIMIT } from '~/config';
import { debounce } from 'lodash-es';
import { createCategory, updateCategory } from '~/http';
import { BookmarksStore } from '~/store';
import { message } from 'ant-design-vue';

const { getCategories } = BookmarksStore();
const props = defineProps<{
  visible: boolean
  category?: Category | null
}>();
const propRefs = toRefs(props);
// eslint-disable-next-line no-unused-vars
const emits = defineEmits<{(event: 'update:visible', val: boolean): void
  // eslint-disable-next-line no-unused-vars
  (event: 'close'): void
}>();
const categoryForm = ref();
const formSchema = reactive(new CompassFormSchema<Category>({
  model: {},
  labelCol: { span: 6 },
  labelAlign: 'left',
  items: [{
    fieldType: 'input',
    name: 'name',
    label: '名称',
    placeholder: '请输入分类名称',
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
    description: [{
      max: DESC_MAX_LIMIT,
      message: `描述内容长度应该小于${DESC_MAX_LIMIT}`,
    }],
  },
}));
watch(propRefs.category as unknown as Category, (val) => {
  formSchema.model = {...val};
});

function close() {
  emits('update:visible', false);
  emits('close');
  categoryForm.value?.resetFields();
}
const submit = debounce(async () => {
  const valid = await categoryForm.value?.validateFields();
  if (!valid) return;
  const params = {
    name: formSchema.model.name,
    scoped: 'bookmarks' as const,
    description: formSchema.model.description,
    parentId: formSchema.model.parentId,
  };
  if (!propRefs.category?.value) {
    createCategory(params).subscribe(
      () => {
        getCategories();
        message.success('创建分类成功');
        close();
      },
    );
    return;
  }
  updateCategory(formSchema.model.id, params).subscribe(
    () => {
      getCategories();
      message.success('更新分类成功');
      close();
    },
  );
}, 200);
</script>

<template>
  <a-modal
    :visible="visible"
    :title="category ? '修改分类' : '新增分类'"
    width="400px"
    ok-text="确 定"
    cancel-text="取 消"
    @ok="submit"
    @cancel="close"
  >
    <CompassForm
      ref="categoryForm"
      :schema="formSchema"
    />
  </a-modal>
</template>
