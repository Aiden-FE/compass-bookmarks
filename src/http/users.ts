import Http from './http';

export function getUserInfoById(userId: number) {
  return Http.get(`users/${userId}`);
}

export function getUsers () {
  return Http.get('users');
}

export function login (data: {
  phone?: string
  email?: string
  emailCaptcha?: number
  smsCaptcha?: number
  password: string
}) {
  return Http.post('users/login')
    .body(data)
}
