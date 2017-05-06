import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { UserService } from './user.service';
import type { UserAction } from './user.reducer';
import { setUser, loginRequested, loginSucceeded, loginFailed, LOGIN_REQUESTED } from './user.reducer';

function* login(action: UserAction) {
  try {
    const token = yield UserService.login(action.payload);
    yield put(loginSucceeded())
  } catch (e) {
    yield put(loginFailed(e));
  }
}

export function* userSaga() {
  yield takeLatest(LOGIN_REQUESTED, login);
}
