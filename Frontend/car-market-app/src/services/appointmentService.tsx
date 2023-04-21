import { apiUrl } from "../constants";
import { AppointmentCreateModel } from "../models/AppointmentModel";
import { store } from "../redux/store";
import { authenticatedFetch } from "./authenticatedFetch";


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

export const postAppointment = (appointment: AppointmentCreateModel): Promise<Response> => {

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    body: JSON.stringify({ firstName: appointment.firstName, lastName: appointment.lastName,
      phone: appointment.phone, date: appointment.date, vehicleId: appointment.vehicleId, appointmentTypeId: appointment.appointmentTypeId })
  };
  return authenticatedFetch(apiUrl + "/api/Appointment/appointments", requestOptions);
}