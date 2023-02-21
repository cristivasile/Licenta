import { apiUrl } from "../constants";

export const postVehicle = (image: string, brand: string, model: string, odometer: number,
    year: number, engineSize: number, power: number, address: string, features: [], price: number, token: string | null): Promise<Response> => {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
        body: JSON.stringify({
            image: image,
            brand: brand,
            model: model,
            odometer: odometer,
            year: year,
            engineSize: engineSize,
            power: power,
            locationAddress: address,
            features: features,
            price: price,
        })
    };
    return fetch(apiUrl + "/api/Vehicle", requestOptions);
}

export const getAvailableVehicles = (token: string | null): Promise<Response> => {
    
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
    };
    return fetch(apiUrl + "/api/Vehicle/getAvailable", requestOptions);
}
