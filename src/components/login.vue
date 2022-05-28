<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { emailValidator, phoneValidator } from '~/utils';
import { EMAIL_CAPTCHA_LENGTH, PASSWORD_MAX_LIMIT, PASSWORD_MIN_LIMIT } from '~/config';
import { message } from 'ant-design-vue';
import { asyncTask } from '@compass-aiden/utils';
import { login } from '~/http';
import { debounce } from 'lodash-es';
import { userStore } from '~/store';
import { CompassForm, CompassFormSchema } from './common';

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const { setUserInfo } = userStore();
// eslint-disable-next-line no-unused-vars
const emits = defineEmits<{(event: 'update:visible', val: boolean): void
}>();

const { t } = useI18n();

const compassForm = ref();
const loginMode = ref<'email' | 'phone'>('email');
const formSchema = reactive(new CompassFormSchema({
  model: {},
  items: [{
    fieldType: 'input',
    name: 'email',
    label: '邮箱',
    placeholder: '请输入邮箱',
    isShow: () => loginMode.value === 'email',
  }, {
    fieldType: 'phone',
    name: 'phone',
    label: '手机号',
    placeholder: '请输入手机号',
    isShow: () => loginMode.value === 'phone',
  }, {
    fieldType: 'password',
    name: 'password',
    label: '密码',
    placeholder: '请输入密码',
  }, {
    fieldType: 'captcha',
    name: 'imageCaptcha',
    label: '验证码',
    placeholder: '请输入验证码',
  }, {
    fieldType: 'emailCaptcha',
    name: 'emailCaptcha',
    label: '邮件验证码',
    placeholder: '请输入邮件验证码',
    isShow: () => loginMode.value === 'email',
    beforeSendEmail: async () => {
      const [err, resp] = await asyncTask(compassForm.value.validateFields([
        'email',
        'imageCaptcha',
      ]));
      if (err || !resp) {
        message.warn(
          `请先输入正确的${
            loginMode.value === 'email'
              ? '邮箱'
              : '手机号码'
          }或图形验证码`,
        );
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    },
  }],
  rules: {
    emailCaptcha: [{
      required: true,
      message: '请输入邮件验证码',
    }, {
      max: EMAIL_CAPTCHA_LENGTH,
      min: EMAIL_CAPTCHA_LENGTH,
      message: '请输入六位验证码',
    }],
    email: {
      required: true,
      validator: (_, value, callback) => {
        if (loginMode.value === 'phone') return Promise.resolve();
        return emailValidator(_, value, callback);
      },
    },
    phone: {
      required: true,
      validator: (_, value, callback) => {
        if (loginMode.value === 'email') return Promise.resolve();
        return phoneValidator(_, value, callback);
      },
    },
    password: [{
      required: true,
      message: '请输入密码',
    }, {
      max: PASSWORD_MAX_LIMIT,
      min: PASSWORD_MIN_LIMIT,
      message: `密码最大长度${PASSWORD_MAX_LIMIT}位,最小长度${PASSWORD_MIN_LIMIT}位`,
    }],
    imageCaptcha: {
      required: true,
      max: 4,
      min: 4,
      message: '请输入正确的验证码',
    },
  },
  labelCol: { span: 6 },
  labelAlign: 'left',
}));

const close = () => {
  emits('update:visible', false);
};
const submit = debounce(async () => {
  const result = await compassForm.value?.validateFields();
  if (!result) return;
  const params = {
    password: result.password,
    ...(loginMode.value === 'email'
      ? { email: result.email, emailCaptcha: Number(result.emailCaptcha) }
      : {
        phone: `${result.countryCode} ${result.phone}`,
        smsCaptcha: Number(result.smsCaptcha),
      }),
  };
  login(params).subscribe(
    (ctx) => {
      message.success('登录成功');
      setUserInfo(ctx);
      close();
    },
  );
}, 200);
const toggleLoginMode = () => {
  loginMode.value = loginMode.value === 'email' ? 'phone' : 'email';
};
</script>
<template>
  <a-modal
    :visible="visible"
    :title="t('login')"
    width="400px"
    :footer="null"
    @cancel="close"
  >
    <CompassForm
      ref="compassForm"
      :schema="formSchema"
    />
    <a-button
      type="primary"
      block
      @click="submit"
    >
      登 录
    </a-button>
    <a-divider plain>
      第三方账号登录
    </a-divider>
    <p class="text-center">
      <a-button
        type="link"
        @click="toggleLoginMode"
      >
        {{ loginMode === 'email' ? '手机登录' : '邮箱登录' }}
      </a-button>
      <a-button type="link">
        验证码登录
      </a-button>
      <a-button type="link">
        注册账号
      </a-button>
      <a-button type="link">
        忘记密码
      </a-button>
    </p>
  </a-modal>
</template>
