/* @flow */
import { API_ROOT } from '../../config';
import { OAuth2 } from '../../utils';
import type { Token } from '../../utils';
var moment = require('moment');

export const UserService = {
  login,
}

export type LoginConfig = {
  username: string,
  password: string,
};

function login(options: LoginConfig) {
  return OAuth2.getToken(options);
}
