import { apiUrl } from "../constants";
import { store } from "../redux/store";
import { authenticatedFetch } from "./fetchInterceptor";

export const postBodyType = (name: string): Promise<Response> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ name: name })
  };
  return authenticatedFetch(apiUrl + "/api/Body-Type", requestOptions);
}

export const getBodyTypes = (): Promise<Response> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/Body-Type/getAll", requestOptions);
}

export const removeBodyType = (name: string): Promise<Response> => {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/Body-Type/" + name, requestOptions);
}
