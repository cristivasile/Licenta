import { apiUrl } from "../constants";
import { store } from "../redux/store";
import { authenticatedFetch } from "./fetchInterceptor";

export const postLocation = (addressValue: string): Promise<Response> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ address: addressValue })
  };
  return authenticatedFetch(apiUrl + "/api/Location", requestOptions);
}

export const getLocations = (): Promise<Response> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/Location/getAll", requestOptions);
}