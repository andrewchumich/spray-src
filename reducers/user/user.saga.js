import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { UserService } from './user.service';
import type { UserAction } from './user.reducer';
import { setUser, loginRequested, loginSucceeded, loginFailed, LOGIN_REQUESTED } from './user.reducer';
import { actions } from 'react-native-navigation-redux-helpers';
import { ROUTES } from '../../routes';
const {
  pushRoute,
  popRoute,
} = actions;

function* login(action: UserAction) {
  try {
    const token = yield UserService.login(action.payload);
    yield put(loginSucceeded());
    yield put(pushRoute({
      key: ROUTES.map,
    }, 'global'));
  } catch (e) {
    yield put(loginFailed(e));
  }
}

export function* userSaga() {
  yield takeLatest(LOGIN_REQUESTED, login);
}
