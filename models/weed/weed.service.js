/* @flow */
import { API_ROOT } from '../../config';
import { OAuth2, getToken } from '../../utils';
import type { Token } from '../../utils';
import { BaseViewService, fetchWrap } from '../../utils';
import { User } from '../../reducers/user';
import * as queryString from 'query-string';
import { isEmpty } from 'lodash';

export type WeedConfig = {
  id: string,
  name: string,
  sciname: string,
}

export const REQUIRED_PROPS = [
  'id',
  'name',
  'sciname',
];

export class Weed {
  id: string;
  name: string;
  sciname: string;

  constructor(weed: WeedConfig) {
    if (!this.isValidSectionConfig(weed)) {
      throw Error('Weed constructor invalid', weed);
    } else {
      Object.assign(this, weed);
    }
  }

  isValidSectionConfig(config: WeedConfig) {
    return REQUIRED_PROPS.every(k => k in config);
  }
}


const WEED_URL = API_ROOT + '/weeds'

export class WeedService extends BaseViewService {
  constructor() {
    super();
    this.endpoint = WEED_URL;
  }

  async list(): Promise<Weed[]> {
    const weed_res: any[] = await fetchWrap(this.endpoint);
    const weeds: Weed[] =  weed_res.map((weed) => {
      return new Weed(weed);
    });

    return await weeds;
  }
}
