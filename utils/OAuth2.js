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

function setToken(t: Token) {
  console.log(t);
  t.expires_time = (new Date).getTime() + t.expires_in * 1000;
  TOKEN = { ...t };
  return TOKEN;
}

function tokenIsValid(t: ?Token) {
  const current_time = (new Date).getTime();
  return (t !== null && typeof t === 'object' && t.expires_time && current_time > t.expires_time);
}

export const OAuth2 = {
  getFormData: function(data: any) {
    var formData = new FormData();

    for (var k in data) {
        formData.append(k, data[k]);
    }
    return formData;
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
            'Accept': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: this.getFormData({
            ...BASE_CONFIG,
            ...config,
          }),
        }).then((res) => res.json()).then(
          (res) => {
            resolve(setToken(res));
          },
          (err) => reject(err)
        );
      }
    });
  }
};
