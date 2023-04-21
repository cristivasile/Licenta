import { apiUrl } from "../constants";
import { AppointmentCreateModel } from "../models/AppointmentModel";
import { store } from "../redux/store";
import { authenticatedFetch } from "./authenticatedFetch";
import { isAdmin } from "./authenticationService";


export const getAppointmentByVehicleId = (vehicleId: string): Promise<Response> => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
    };
    return authenticatedFetch(apiUrl + "/api/Appointment/appointmentByVehicle/" + vehicleId, requestOptions);
} 

export const getAvailableIntervals = (locationId: string, duration: number, daysToGenerate: number = 60): Promise<Response> => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
      body: JSON.stringify({ locationId: locationId, appointmentDuration: duration, numberOfDaysToGenerate: daysToGenerate })
    };
    return authenticatedFetch(apiUrl + "/api/Appointment/availableIntervals", requestOptions);
}

export const getAppointmentsByLocationId = (locationId: string, upcoming: boolean): Promise<Response> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/Appointment/all/appointmentsByLocationId/" + locationId + "/" + upcoming, requestOptions);
}

export const postAppointment = (appointment: AppointmentCreateModel): Promise<Response> => {

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ firstName: appointment.firstName, lastName: appointment.lastName,
      phone: appointment.phone, date: appointment.date, vehicleId: appointment.vehicleId, appointmentTypeId: appointment.appointmentTypeId })
  };
  return authenticatedFetch(apiUrl + "/api/Appointment/appointments", requestOptions);
}

export const deleteAppointment = (appointmentId: string): Promise<Response> => {
  var userIsAdmin: boolean = isAdmin(store.getState().user.role as string);

  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };

  var endpoint = apiUrl + "/api/Appointment/appointments/";
  if (userIsAdmin){
      endpoint += "admin/" 
  }

  return authenticatedFetch(endpoint + appointmentId, requestOptions);

}