import { apiUrl } from "../constants";
import { store } from "../redux/store";
import { authenticatedFetch } from "./fetchInterceptor";

export const postFeature = (name: string): Promise<Response> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ name: name })
  };
  return authenticatedFetch(apiUrl + "/api/Feature", requestOptions);
}

export const getFeatures = (): Promise<Response> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/Feature/getAll", requestOptions);
}

export const removeFeature = (name: string): Promise<Response> => {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/Feature/" + name, requestOptions);
}

export const updateFeature = (name: string, updatedName: string): Promise<Response> => {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ name: updatedName })
  };
  return authenticatedFetch(apiUrl + "/api/Feature/" + name, requestOptions);
}