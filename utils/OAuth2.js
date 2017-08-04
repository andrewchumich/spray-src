/* @flow */
import { API_ROOT, CLIENT_ID } from '../config';
import type { LoginConfig } from '../reducers/user';
export type Token = {
  access_token: string,
  /**
  * seconds until token expires
  */
  expires_in: number,
  refresh_token: string,
  scope: string,
  token_type: string,
  expires_time?: number,
};

// eventually this needs to be set by a sign in process
const BASE_CONFIG = {
  client_id: CLIENT_ID,
  grant_type: 'password',
};

let TOKEN: ?Token = null;

export function getToken(): ?Token {
  return TOKEN;
}

export function setToken(t: Token) {
  console.log(t);
  t.expires_time = (new Date).getTime() + t.expires_in * 1000;
  TOKEN = { ...t };
  return TOKEN;
}

export function tokenIsValid(t: ?Token) {
  const current_time = (new Date).getTime();
  return (t !== null && typeof t === 'object' && t.expires_time && current_time > t.expires_time);
}

export const OAuth2 = {
  getFormData: function(data: any) {
    return Object.keys(data).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
    }).join('&');
  },
  getToken: function(config: LoginConfig) {
    return new Promise((resolve, reject) => {
      if (tokenIsValid(TOKEN)) {
        resolve(TOKEN);
      } else {
        const URL = API_ROOT + '/token/';
        return fetch(URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.getFormData({
            ...BASE_CONFIG,
            ...config,
          }),
        }).then((res) => {
          if (res.ok) {
            return res.json()
          } else {
            return Promise.reject(res);
          }
        }).then(
          (res) => {
              resolve(setToken(res));
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
      }
    });
  },
};
