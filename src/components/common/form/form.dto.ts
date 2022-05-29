import { FormItemProps, FormProps } from 'ant-design-vue';
import { Slot } from 'vue';

interface CompassFormFieldDto {
  fieldType: 'input'
    | 'password'
    | 'phone'
    | 'captcha'
    | 'emailCaptcha'
    | 'select'
  // eslint-disable-next-line
  isShow?: (item: CompassFormItemType) => boolean
  placeholder?: string
}

export interface CompassFormInputFieldDto extends CompassFormFieldDto {
  fieldType: 'input'
}

export interface CompassFormPhoneFieldDto extends CompassFormFieldDto {
  fieldType: 'phone'
}

export interface CompassFormPasswordFieldDto extends CompassFormFieldDto {
  fieldType: 'password'
}

export interface CompassFormCaptchaFieldDto extends CompassFormFieldDto {
  fieldType: 'captcha'
}

export interface CompassFormEmailCaptchaFieldDto extends CompassFormFieldDto {
  fieldType: 'emailCaptcha'
  beforeSendEmail: (field: CompassFormEmailCaptchaFieldDto) => Promise<boolean>
}

export interface CompassFormSelectFieldDto extends CompassFormFieldDto {
  fieldType: 'select'
  mode?: 'multiple' | 'tags' | 'combobox'
  options?: {
    value: unknown
    label: string
    disabled?: boolean
    key?: unknown
    title?: string
  }[]
  notFoundContent?: string | Slot
}

export type CompassFormItemType = (FormItemProps & (
  CompassFormPasswordFieldDto
  | CompassFormInputFieldDto
  | CompassFormPhoneFieldDto
  | CompassFormCaptchaFieldDto
  | CompassFormEmailCaptchaFieldDto
  | CompassFormSelectFieldDto
))

export class CompassFormSchema<Model = FormProps['model']> {
  model: Model;

  layout?: FormProps['layout'];

  rules?: FormProps['rules'];

  labelCol?: FormProps['labelCol'];

  labelAlign?: FormProps['labelAlign'];

  items?: CompassFormItemType[];

  constructor(opts: {[T in keyof CompassFormSchema]: CompassFormSchema[T]}) {
    this.model = opts.model as Model;
    this.layout = opts.layout || 'horizontal';
    this.rules = opts.rules;
    this.items = opts.items;
    this.labelCol = opts.labelCol;
    this.labelAlign = opts.labelAlign;
  }
}
