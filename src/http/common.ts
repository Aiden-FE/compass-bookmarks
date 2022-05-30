import Http from './http';

export function getImageCaptcha(query?: object) {
  return Http.get('open/captcha')
    .config({
      // @ts-ignore
      disableResponseInterceptor: true,
    })
    .query(query);
}

export function sendEmailCaptcha(data: {
  email: string,
  imageCaptcha: string,
}) {
  return Http.post('/open/captcha/email')
    .body(data);
}
