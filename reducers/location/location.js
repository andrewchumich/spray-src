import React from 'react';
import { SET_LOCATION, START_SPRAYING, STOP_SPRAYING } from '../../actions/location';
import {REHYDRATE} from 'redux-persist/constants'
import { Section, SectionConfig, isValidSectionConfig } from './section';
import { Position } from '../../utils';
import { cloneDeep } from 'lodash';

export type LocationState = {
  /**
   * Current section
   */
  current: ?Section,
  rehydrated: boolean,
  /**
   * {
   *   date: [Section, ...]
   * }
   */
  list: any,
};

export const LocationPropTypes = {
  list: React.PropTypes.object,
  current: React.PropTypes.object,
  rehydrated: React.PropTypes.bool,
}

export const initialState: LocationState = {
  /**
   * Current coordinates
   * {
   *
   * }
   */
  current: null,
  rehydrated: false,
  list: {},
};

export const getToday = () => {
  const d = new Date();
  return d.getFullYear() + '-' + (1 + d.getMonth()) + '-'  + d.getDate();
}

export const getTodaysList = (state: LocationState): Section[] => {
  const today = getToday();
  if (state.hasOwnProperty('list') && state.list.hasOwnProperty(today)) {
    return state.list[today];
  } else {
    return [];
  }
};

const defaultAction = {
  type: 'NONE',
  payload: undefined,
};

export function locationReducer(state:LocationState=initialState, action=defaultAction): LocationState {
  const today = getToday();
  const todays_list = getTodaysList(state);
  switch (action.type) {
    case SET_LOCATION:
      const p: Position = action.payload;
      if (state.current !== null && state.current instanceof Section) {
        state.current.addPosition(p);
      }

      return {
        ...state,
      };
    case START_SPRAYING:
      const section_config = {
        ...action.payload,
        index: todays_list.length,
      };
      if (!isValidSectionConfig(section_config)) {
        return state;
      }
      const section = new Section(section_config);
      let list = {
        ...state.list,
      };
      list[today] = todays_list;
      return {
        ...state,
        current: section,
        list,
      };
    case STOP_SPRAYING:
      if (state.current !== null) {
        const current_copy: Section  = cloneDeep(state.current);
        current_copy.setEndTime();
        let list = {
          ...state.list,
        };

        if (current_copy.line.coordinates.length > 0) {
          list[today] = [...todays_list, current_copy];
        }

        return {
          ...state,
          list,
          current: null,
        };
      } else {
        return state;
      }
    case REHYDRATE:
      const location = action.payload.location;
      if (location) {
        return {
          ...location,
          current: (location.current === null) ? null : location.current,
          rehydrated: true,
        };
      } else {
        return {
          ...state,
          current: (state.current === null) ? null : state.current,
          rehydrated: true,
        };
      }
    default:
      return state;
  }
}
