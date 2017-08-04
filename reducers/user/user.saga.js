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
    console.log(action);
    const token = yield UserService.login(action.payload);
    const user: User = yield UserService.getByUsername(action.payload.username);
    yield put(loginSucceeded(user));
    yield put(pushRoute({
      key: ROUTES.map,
    }, 'global'));
  } catch (e) {
    console.error('Login Failed:', e);
    yield put(loginFailed(e));
  }
}

export function* userSaga() {
  yield takeLatest(LOGIN_REQUESTED, login);
}
