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

export const postVehicle = (image: string, brand: string, model: string, description: string, address: string, odometer: number, 
    year: number, engineSize: number, power: number, features: [], price: number): Promise<Response> => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " +  store.getState().user.token },
        body: JSON.stringify({
            image: image,
            brand: brand,
            model: model,
            description: description,
            odometer: odometer,
            year: year,
            engineSize: engineSize,
            power: power,
            locationAddress: address,
            features: features,
            price: price,
        })
    };
    return authenticatedFetch(apiUrl + "/api/Vehicle", requestOptions);
}

export const getAvailableVehicles = (): Promise<Response> => {
    
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    };
    return authenticatedFetch(apiUrl + "/api/Vehicle/getAvailable", requestOptions);
}
