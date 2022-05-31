import isEmail from 'validator/lib/isEmail';
import { ValidatorRule } from 'ant-design-vue/lib/form/interface';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isURL from 'validator/lib/isURL';

export const emailValidator: ValidatorRule['validator'] = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('邮箱不可为空'));
  }
  const result = isEmail(value);
  if (!result) {
    return Promise.reject(new Error('请输入正确的邮箱'));
  }
  return Promise.resolve();
};

export const phoneValidator: ValidatorRule['validator'] = (_, value) => {
  if (!value) return Promise.reject(new Error('请输入手机号码'));
  const valid = isMobilePhone(value);
  if (!valid) return Promise.reject(new Error('请输入正确的手机号码'));
  return Promise.resolve();
};

export const urlValidator: ValidatorRule['validator'] = (_, value) => {
  if (!value) return Promise.reject(new Error('请输入链接地址'));
  const valid = isURL(value);
  if (!valid) return Promise.reject(new Error('请输入有效的URL'));
  return Promise.resolve();
};
