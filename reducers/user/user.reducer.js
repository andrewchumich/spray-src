/* @flow */

import { User,  } from './user';
import type { LoginConfig } from './user.service';

// actions
export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const LOGIN_REQUESTED = 'LOGIN_REQUESTED';
export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export type UserAction =
  { type: 'SET_USER', payload: User }
  | { type: 'REMOVE_USER', payload: any }
  | { type: 'LOGIN_REQUESTED', payload: LoginConfig }
  | { type: 'LOGIN_SUCCEEDED', payload: any }
  | { type: 'LOGIN_FAILED', payload: any }
  | { type: 'NONE', payload: any };


// Action creators
export function setUser(user: User): UserAction {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function removeUser(): UserAction {
  return {
    type: REMOVE_USER,
    payload: undefined,
  };
}

export function loginRequested(user: LoginConfig): UserAction {
  return {
    type: LOGIN_REQUESTED,
    payload: user,
  };
}

export function loginSucceeded(user: User): UserAction {
  return {
    type: LOGIN_SUCCEEDED,
    payload: user,
  };
}

export function loginFailed(e: Error): UserAction {
  return {
    type: LOGIN_FAILED,
    payload: e,
  };
}

// UserState type
export type UserState = {
  user: ?User,
  loading: boolean,
  // TODO - add groups
  group?: any,
  error: ?Error,
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: undefined,
};

const defaultAction = {
  type: 'NONE',
  payload: undefined,
};

// reducer
export function userReducer(state:UserState=initialState, action: UserAction=defaultAction): UserState {
  switch (action.type) {
    case SET_USER:
      if (action.payload instanceof User) {
        return {
          ...state,
          user: action.payload,
        };
      } else {
        return state;
      }
    case REMOVE_USER:
      return {
        ...state,
        user: null,
      };
    case LOGIN_REQUESTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCEEDED:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
