/* @flow */
import { getToken } from './OAuth2';

export async function fetchWrap(url: string, request: any) {
  // get token
  const token = getToken();
  if (!token) {
    throw new Error(token);
  }

  let merged_request = {
    ...request,
    headers: {
      ...request.headers,
      'Authorization': 'Bearer ' + token.access_token,
    }
  };

  return await fetch(url, merged_request);
}
