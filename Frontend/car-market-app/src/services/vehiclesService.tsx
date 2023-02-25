import { apiUrl } from "../constants";
import { authenticatedFetch } from "./fetchInterceptor";

export const postVehicle = (image: string, brand: string, model: string, description: string, address: string, odometer: number, 
    year: number, engineSize: number, power: number, features: [], price: number, token: string | null): Promise<Response> => {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
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

export const getAvailableVehicles = (token: string | null): Promise<Response> => {
    
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
    };
    return authenticatedFetch(apiUrl + "/api/Vehicle/getAvailable", requestOptions);
}
