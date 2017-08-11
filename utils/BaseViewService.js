/* @flow */
import { fetchWrap } from './FetchWrap';

export class BaseViewService {

  endpoint: string;

  constructor() {

  }

  async get(id: number, options: any) {}

  async list(options: any) {}

  async update(id: number, options: any) {}

}
