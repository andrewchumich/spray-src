/* @flow */
import type { Action } from './types';
import { Position } from '../reducers/location';
import type { SprayState } from '../reducers/spray';
// constants
export const SET_LOCATION = 'SET_LOCATION';
export const START_SPRAYING = 'START_SPRAYING';
export const STOP_SPRAYING = 'STOP_SPRAYING';

// action creators
export function setLocation(location: Position):Action {
  return {
    type: SET_LOCATION,
    payload: location,
  };
};

// action creators
export function startSpraying(spray: SprayState):Action {
  return {
    type: START_SPRAYING,
    payload: spray,
  };
};

export function stopSpraying():Action {
  return {
    type: STOP_SPRAYING,
    payload: undefined,
  };
};
