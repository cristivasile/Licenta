import { apiUrl } from "../constants";
import { store } from "../redux/store";
import { authenticatedFetch } from "./authenticatedFetch";

export const getAppointmentTypesBylocationId = (locationId: string): Promise<Response> => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
    };
    return authenticatedFetch(apiUrl + "/api/Appointment/types/" + locationId, requestOptions);
  } 

export const postAppointmentType = (name: string, duration: number, locationId: string): Promise<Response> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ name: name, duration: duration, locationId: locationId })
  };
  return authenticatedFetch(apiUrl + "/api/Appointment/types", requestOptions);
}

export const putAppointmentType = (id: string, name: string, duration: number, locationId: string): Promise<Response> => {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ name: name, duration: duration, locationId: locationId })
  };
  return authenticatedFetch(apiUrl + "/api/Appointment/types/" + id, requestOptions);
}

export const deleteAppointmentType = (id: string): Promise<Response> => {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/Appointment/types/" + id, requestOptions);
}
