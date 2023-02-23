import { apiUrl } from "../constants";
import { authenticatedFetch } from "./fetchInterceptor";

export const postLocation = (addressValue: string, token: string | null): Promise<Response> => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
        body: JSON.stringify({ address: addressValue})
      };
    return authenticatedFetch(apiUrl + "/api/Location", requestOptions);
}

export const getLocations = (token: string | null): Promise<Response> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token }
  };
  return authenticatedFetch(apiUrl + "/api/Location/getAll", requestOptions);
}