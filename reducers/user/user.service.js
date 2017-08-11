/* @flow */
import { API_ROOT } from '../../config';
import { OAuth2, getToken } from '../../utils';
import type { Token } from '../../utils';
import { tokenIsValid, BaseViewService, fetchWrap } from '../../utils';
import { User } from './user';
import type { UserConfig } from './user';
import * as queryString from 'query-string';
import { isEmpty } from 'lodash';

var moment = require('moment');

const USER_URL = API_ROOT + '/users';

// export const UserService = {
//   login,
//   getByUsername,
// }

class UserService extends BaseViewService {
  constructor() {
    super();
    this.endpoint = USER_URL;
  }

  login(options: LoginConfig) {
    return OAuth2.getToken(options);
  }

  /**
  * {id} - user id
  * {params} - query-string params
  */
  async get(id: number, params: any) {
    if (id === undefined || id === null) {
      throw Error('UserService::get -- id required');
    }

    let url = this.endpoint + '/' + id.toString();

    if (!isEmpty(params)) {
      url += '?' + queryString.stringify(params);
    }

    return await(await fetchWrap(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })).json();
  }

  async getCurrent(): Promise<User> {
    let url = API_ROOT + '/currentuser';

    console.log(getToken());

    let user_data: UserConfig = await (await fetchWrap(url,  {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })).json();

    console.log(user_data);

    return new User(user_data);
  }
}

export let userService = new UserService();

export type LoginConfig = {
  username: string,
  password: string,
};

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
        // $FlowFixMe - TOKEN is checked in tokenIsValid above
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
