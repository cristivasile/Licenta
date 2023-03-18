import { apiUrl } from "../constants";
import { DriveTrainType } from "../models/DriveTrainTypeEnum";
import { PowerTrainType } from "../models/PowerTrainTypeEnum";
import { store } from "../redux/store";
import { authenticatedFetch } from "./fetchInterceptor";

export interface VehiclePostModel{
    image: string,
    thumbnailImage: string,
    brand: string,
    model: string,
    bodyType: string,
    description: string,
    address: string,
    odometer: number,
    year: number,
    //driveTrain: DriveTrainType,
    //powerTrain: PowerTrainType,
    engineSize: number | null,
    power: number,
    torque: number,
    features: string[],
    price: number
}

export const postVehicle = (newVehicle: VehiclePostModel): Promise<Response> => {

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