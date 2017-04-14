import { initialState, locationReducer, getToday, LocationState, getTodaysList } from './location';
import { setLocation, startSpraying, stopSpraying } from '../../actions/location';
import { SprayState, BoomOrientation } from '../../reducers/spray';

import { Position } from '../../utils';

test('has initialState', () => {
    const test_initial_state = locationReducer();
    expect(test_initial_state).toMatchObject(initialState);
});

test('should be able to create section', () => {
    const test_initial_state = locationReducer();
    expect(test_initial_state.current).toBe(null);

    const p: Position = [0, 1, 1000];
    const spray_state: SprayState = {
        spray: false,
        chemical_id: 1,
        chemical_flow: 10,
        county_id: 1,
        weed_ids: [1, 2],
        boom: 'BOTH',
        boom_size: 15,
    };
    const today = getToday();
    const after_start_spray_state = locationReducer(test_initial_state, startSpraying(spray_state));
    expect(after_start_spray_state.current.chemical_flow).toBe(spray_state.chemical_flow);
    expect(after_start_spray_state.list[today].length).toBe(0);
});

test('when setting location while spraying, should append to current section', () => {
    const test_initial_state = locationReducer();

    const p: Position = [0, 1, 1000];
    const p2: Position = [0, 2, 1000];
    const spray_state: SprayState = {
        spray: false,
        chemical_id: 1,
        chemical_flow: 10,
        county_id: 1,
        weed_ids: [1, 2],
        boom: 'BOTH',
        boom_size: 15,
    };
    const today = getToday();
    const after_start_spray_state = locationReducer(test_initial_state, startSpraying(spray_state));
    expect(after_start_spray_state.current.chemical_flow).toBe(spray_state.chemical_flow);

    const after_set_location_0 = locationReducer(after_start_spray_state, setLocation(p));
    expect(after_set_location_0.current.line.coordinates.length).toBe(1);
    expect(after_set_location_0.current.line.coordinates[0]).toBe(p);

    const after_set_location_1 = locationReducer(after_start_spray_state, setLocation(p2));
    expect(after_set_location_1.current.line.coordinates.length).toBe(2);
    expect(after_set_location_1.current.line.coordinates[1]).toBe(p2);
});

test('should be able to stop spraying', () => {
    const test_initial_state = locationReducer();

    const p: Position = [0, 1, 1000];
    const p2: Position = [0, 2, 1000];
    const spray_state: SprayState = {
        spray: false,
        chemical_id: 1,
        chemical_flow: 10,
        county_id: 1,
        weed_ids: [1, 2],
        boom: 'BOTH',
        boom_size: 15,
    };
    const today = getToday();
    const after_start_spray_state = locationReducer(test_initial_state, startSpraying(spray_state));
    expect(after_start_spray_state.current.chemical_flow).toBe(spray_state.chemical_flow);

    const after_set_location_0 = locationReducer(after_start_spray_state, setLocation(p));
    const after_set_location_1 = locationReducer(after_set_location_0, setLocation(p2));

    const after_stop_spray = locationReducer(after_set_location_1, stopSpraying());
    expect(after_stop_spray.current).toBe(null);
    const todays_list = getTodaysList(after_stop_spray);

    expect(todays_list[0].index).toBe(0);
    expect(todays_list[0].endTime).not.toBe(null);
});

test('shouldnt add section if no locations', () => {
  const test_initial_state = locationReducer();

  const p: Position = [0, 1, 1000];
  const p2: Position = [0, 2, 1000];
  const spray_state: SprayState = {
      spray: false,
      chemical_id: 1,
      chemical_flow: 10,
      county_id: 1,
      weed_ids: [1, 2],
      boom: 'BOTH',
      boom_size: 15,
  };
  const today = getToday();
  const after_start_spray_state = locationReducer(test_initial_state, startSpraying(spray_state));
  expect(after_start_spray_state.current.chemical_flow).toBe(spray_state.chemical_flow);

  const after_stop_spray_0 = locationReducer(after_start_spray_state, stopSpraying());
  expect(after_stop_spray_0.current).toBe(null);
  const todays_list_0 = getTodaysList(after_stop_spray_0);
  expect(todays_list_0.length).toBe(0);

  const after_set_location_0 = locationReducer(after_start_spray_state, setLocation(p));
  const after_set_location_1 = locationReducer(after_set_location_0, setLocation(p2));

  const after_stop_spray_1 = locationReducer(after_start_spray_state, stopSpraying());

  const todays_list_1 = getTodaysList(after_stop_spray_1);

  expect(todays_list_1.length).toBe(1);
});

// todo
test('when setting location while spraying, should set index to selection', () => {
    const test_initial_state = locationReducer();

    const p: Position = [0, 1, 1000];
    const p2: Position = [0, 2, 1000];
    const spray_state: SprayState = {
        spray: false,
        chemical_id: 1,
        chemical_flow: 10,
        county_id: 1,
        weed_ids: [1, 2],
        boom: 'BOTH',
        boom_size: 15,
    };
    const today = getToday();
    const after_start_spray_state = locationReducer(test_initial_state, startSpraying(spray_state));

    expect(after_start_spray_state.current.chemical_flow).toBe(spray_state.chemical_flow);

    const after_set_location_0: LocationState = locationReducer(after_start_spray_state, setLocation(p));
    const after_set_location_1: LocationState = locationReducer(after_set_location_0, setLocation(p2));
    expect (after_set_location_1.current.index).toBe(0);
});
