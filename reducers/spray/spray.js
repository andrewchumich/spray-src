/* @flow */
import React from 'react';
import { SET_SPRAY, } from '../../actions/spray';
import { START_SPRAYING, STOP_SPRAYING } from '../../actions/location';
import type { BoomOrientation } from './boom';
import {REHYDRATE} from 'redux-persist/constants'

import type { Action } from '../../../actions/types';
export type SprayState = {
  spray: boolean,
  chemical_id: ?number,
  chemical_flow: ?number,
  county_id: ?number,
  weed_ids: number[],
  boom: ?BoomOrientation,
  boom_size: ?number,
  user_id: number,
  group_id: number,
};

export const SprayPropTypes = {
  spray: React.PropTypes.bool,
  chemical_id: React.PropTypes.number,
  chemical_flow: React.PropTypes.number,
  county_id: React.PropTypes.number,
  weed_ids: React.PropTypes.arrayOf(React.PropTypes.number),
  boom: React.PropTypes.string,
  boom_size: React.PropTypes.number,
  user_id: React.PropTypes.number,
  group_id: React.PropTypes.number,
};

const initialState: SprayState = {
  spray: false,
  chemical_id: null,
  chemical_flow: null,
  county_id: null,
  weed_ids: [],
  boom: null,
  boom_size: null,
  user_id: -1,
  group_id: -1,
};

export function sprayReducer(state:SprayState=initialState, action: Action) {
  switch (action.type) {
    case SET_SPRAY:
      return {
        ...state,
        ...action.payload,
      };
    case START_SPRAYING:
      return {
        ...state,
        spray: true,
      };
    case STOP_SPRAYING:
      return {
        ...state,
        spray: false,
      };
    case REHYDRATE:
      const spray = action.payload.spray;
      if (spray) {
        return {
          ...spray,
          spray: false,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
