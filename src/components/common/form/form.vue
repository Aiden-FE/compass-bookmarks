<script setup lang="ts">
import { getImageCaptcha, sendEmailCaptcha } from '~/http';
import { debounce } from 'lodash-es';
import { FormInstance, message } from 'ant-design-vue';
import { asyncTask } from '@compass-aiden/utils';
import { Ref } from 'vue';
import { CompassFormEmailCaptchaFieldDto, CompassFormSchema } from './form.dto';

const props = defineProps({
  schema: {
    type: CompassFormSchema,
    required: true,
  },
});
const cpForm = ref<FormInstance>();
const schemaRef = ref(props.schema) as Ref<CompassFormSchema>;
const countryCode = ref('+86');
const svgCaptcha = ref('');
const emailTimer = ref(0);
const emailLoading = ref(false);

const getImgCaptcha = debounce(() => {
  getImageCaptcha({
    width: 100,
    height: 32,
  }).subscribe(
    (svg) => {
      svgCaptcha.value = svg;
    },
    (err) => {
      console.error(err);
    },
  );
}, 200);

function sendEmailInterval(initTimer?: number) {
  if (initTimer !== undefined) {
    emailTimer.value = initTimer;
  }
  if (emailTimer.value <= 0) return;
  emailTimer.value -= 1;
  setTimeout(sendEmailInterval, 1000);
}

function hasPhone() {
  if (!schemaRef.value || !schemaRef.value.items) return false;
  return schemaRef.value.items.some((item) => {
    if (item.fieldType === 'phone') {
      if (item.isShow) return item.isShow(item);
      return true;
    }
    return false;
  });
}

/**
 * @description 验证表单是否正确
 */
const validateFields = async (name?: string | string[]) => {
  if (!cpForm.value) {
    return false;
  }
  const [err, resp] = await asyncTask(cpForm.value?.validateFields(name));
  if (err) return false;
  if (hasPhone()) {
    return { countryCode: countryCode.value, ...resp };
  }
  return resp;
};

const getEmailCaptcha = debounce(async (item: CompassFormEmailCaptchaFieldDto) => {
  emailLoading.value = true;
  if (item.beforeSendEmail) {
    const result = await item.beforeSendEmail(item);
    if (!result) return;
  }
  sendEmailCaptcha({
    email: schemaRef.value.model?.email,
    imageCaptcha: schemaRef.value.model?.imageCaptcha,
  }).subscribe(
    () => {
      emailLoading.value = false;
      sendEmailInterval(60);
      message.success('邮件验证码发送成功');
    },
    () => {
      emailLoading.value = false;
    },
  );
}, 200);

defineExpose({
  validateFields,
});

getImgCaptcha();

</script>

<template>
  <a-form
    class="cp-form"
    ref="cpForm"
    :model="schemaRef.model"
    :layout="schemaRef.layout"
    :rules="schemaRef.rules"
    :label-col="schemaRef.labelCol"
    :label-align="schemaRef.labelAlign"
  >
    <div
      v-for="item in schemaRef.items"
      :key="item.name"
    >
      <a-form-item
        v-if="item.isShow ? item.isShow(item) : true"
        :label="item.label"
        :name="item.name"
        class="cp-form__item"
      >
        <a-input
          v-if="item.fieldType === 'input'"
          :class="{
            ['cp-form__item-'+ item.fieldType]: true
          }"
          v-model:value="schemaRef.model[item.name]"
          :placeholder="item.placeholder"
        />
        <a-input
          v-if="item.fieldType === 'phone'"
          :class="{
            ['cp-form__item-'+ item.fieldType]: true
          }"
          v-model:value="schemaRef.model[item.name]"
          :placeholder="item.placeholder"
        >
          <template #addonBefore>
            <a-select
              v-model:value="countryCode"
              style="width: 90px"
            >
              <a-select-option value="+86">
                +86
              </a-select-option>
            </a-select>
          </template>
        </a-input>
        <a-input-password
          v-if="item.fieldType === 'password'"
          :class="{
            ['cp-form__item-'+ item.fieldType]: true
          }"
          v-model:value="schemaRef.model[item.name]"
          :placeholder="item.placeholder"
        />
        <a-input
          v-if="item.fieldType === 'captcha'"
          :class="{
            ['cp-form__item-'+ item.fieldType]: true
          }"
          v-model:value="schemaRef.model[item.name]"
          :placeholder="item.placeholder"
        >
          <template #addonAfter>
            <div
              class="max-h-32px cursor-pointer"
              v-html="svgCaptcha"
              @click="getImgCaptcha"
              @keydown="getImgCaptcha"
            />
          </template>
        </a-input>

        <a-input-group
          compact
          v-if="item.fieldType === 'emailCaptcha'"
          class="!flex"
          :class="{
            ['cp-form__item-'+ item.fieldType]: true
          }"
        >
          <a-input
            v-model:value="schemaRef.model[item.name]"
            :placeholder="item.placeholder"
          />
          <a-button
            @click="getEmailCaptcha(item)"
            :disabled="emailTimer > 0"
            :loading="emailLoading"
            type="primary"
          >
            {{ emailTimer > 0 ? `${emailTimer}s` : '发送验证码' }}
          </a-button>
        </a-input-group>
      </a-form-item>
    </div>
  </a-form>
</template>

<style lang="stylus">
+block(form)
  +element(item-captcha)
    .ant-input-group-addon
      background-color transparent
      border 0
      padding 0
</style>
