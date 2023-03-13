import { apiUrl } from "../constants";
import { store } from "../redux/store";
import { authenticatedFetch } from "./fetchInterceptor";

export const postLocation = (cityValue: string, addressValue: string): Promise<Response> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ city: cityValue, address: addressValue })
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

export const removeLocation = (id: string): Promise<Response> => {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/Location/" + id, requestOptions);
}

export const updateLocation = (id: string, updatedCity: string, updatedAddress: string): Promise<Response> => {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ city: updatedCity, address: updatedAddress })
  };
  return authenticatedFetch(apiUrl + "/api/Location/" + id, requestOptions);
}