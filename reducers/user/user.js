/* @flow */
/**
  {
    "id": 1,
    "password": "pbkdf2_sha256$30000$7ZmiSWQvC9qz$axwxptPEoG2OegtNn5kgtLaY0f/Id64ZKhvnc+bjvJQ=",
    "last_login": "2017-04-28T22:09:12Z",
    "is_superuser": true,
    "username": "achumich",
    "first_name": "",
    "last_name": "",
    "email": "andrew@zerrtech.com",
    "is_staff": true,
    "is_active": true,
    "date_joined": "2017-04-28T22:08:49Z",
    "groups": [
      1
    ],
    "user_permissions": []
  }
*/

export type UserConfig = {
  _id: number,
  password?: string,
  last_login?: Date,
  is_superuser: boolean,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  is_staff?: boolean,
  is_active: boolean,
  date_joined?: Date,
  groups: number[],
  user_permissions: any[],
}

const REQUIRED_PROPS = [
  '_id',
  'is_superuser',
  'username',
  'first_name',
  'last_name',
  'email',
  'is_active',
  'groups',
  'user_permissions',
];

export class User {
  _id: number;
  password: string;
  last_login: Date;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  groups: number[];
  user_permissions: any[];

  isValidSectionConfig(config: UserConfig) {
    return REQUIRED_PROPS.every(k => k in config);
  }

  constructor(config: UserConfig) {
    if (!this.isValidSectionConfig(config)) {
      throw Error('User constructor invalid');
    } else {
      Object.assign(this, config);
    }
  }
}
