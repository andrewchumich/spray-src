/* @flow */
import { API_ROOT } from '../../config';
import { OAuth2 } from '../../utils';
import type { Token } from '../../utils';
import { tokenIsValid, getToken } from '../../utils';
import { User } from './user';
import type { UserConfig } from './user';
import * as queryString from 'query-string';

var moment = require('moment');

const USER_URL = API_ROOT + '/users';

export const UserService = {
  login,
  getByUsername,
}

export type LoginConfig = {
  username: string,
  password: string,
};

function login(options: LoginConfig) {
  return OAuth2.getToken(options);
}

function getByUsername(username: string) {
  const qs = queryString.stringify({ username });
  const url = USER_URL + '?' + qs;
  return new Promise((resolve, reject) => {
    const TOKEN: Token = getToken();
    if (!tokenIsValid(TOKEN)) {
        console.log(TOKEN);
        reject('Token invalid');
    }
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + TOKEN.access_token,
      }
    })
      .then((res) => {
        return res.json();
      })
      .then((user_config: UserConfig) => {
        try {
          let user = new User(user_config);
          resolve(user);
        } catch (e) {
          console.error(e);
          reject(e);
        }
      }, function(e) {
        reject(e);
      });
  });
}
