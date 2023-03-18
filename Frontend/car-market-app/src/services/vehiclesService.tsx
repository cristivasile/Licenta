import { apiUrl } from "../constants";
import { store } from "../redux/store";
import { authenticatedFetch } from "./fetchInterceptor";

export interface VehicleAddModel{
    image: string,
    brand: string,
    model: string,
    description: string,
    address: string,
    odometer: number,
    year: number,
    engineSize: number,
    power: number,
    features: string[],
    price: number
}

export const postVehicle = (newVehicle: VehicleAddModel): Promise<Response> => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " +  store.getState().user.token },
        body: JSON.stringify({
            image: newVehicle.image,
            brand: newVehicle.brand,
            model: newVehicle.model,
            description: newVehicle.description,
            odometer: newVehicle.odometer,
            year: newVehicle.year,
            engineSize: newVehicle.engineSize,
            power: newVehicle.power,
            locationAddress: newVehicle.address,
            features: newVehicle.features,
            price: newVehicle.price,
        })
    };
    return authenticatedFetch(apiUrl + "/api/Vehicle", requestOptions);
}

export const getAvailableVehicles = (): Promise<Response> => {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
        body: "{}", //empty body for no filters
    };
    return authenticatedFetch(apiUrl + "/api/Vehicle/getAvailable", requestOptions);
}

export const getVehicleTypesDictionary = (): Promise<Response> => {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    };
    return authenticatedFetch(apiUrl + "/api/Vehicle/getBrandModelDictionary", requestOptions);
}