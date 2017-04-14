/* @flow */
import type { Action } from '../../actions/types';

export const SET_SPRAY = 'SET_SPRAY';

export function setSpray(spray: any):Action {
  return {
    type: SET_SPRAY,
    payload: spray,
  };
};
