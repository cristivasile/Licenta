import { apiUrl } from "../constants";
import { DriveTrainType } from "../models/DriveTrainTypeEnum";
import { PowerTrainType } from "../models/PowerTrainTypeEnum";
import { store } from "../redux/store";
import { authenticatedFetch } from "./fetchInterceptor";

export interface VehicleCreateModel{
    image: string,
    thumbnailImage: string,
    brand: string,
    model: string,
    bodyType: string,
    description: string,
    address: string,
    odometer: number,
    year: number,
    driveTrain: DriveTrainType,
    powerTrain: PowerTrainType,
    engineSize: number | null,
    locationId: string,
    power: number,
    torque: number,
    features: string[],
    price: number
}

export const postVehicle = (newVehicle: VehicleCreateModel): Promise<Response> => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " +  store.getState().user.token },
        body: JSON.stringify({
            image: newVehicle.image,
            thumbnailImage: newVehicle.thumbnailImage,
            brand: newVehicle.brand,
            model: newVehicle.model,
            bodyType: newVehicle.bodyType,
            description: newVehicle.description,
            odometer: newVehicle.odometer,
            locationId: newVehicle.locationId,
            year: newVehicle.year,
            driveTrainType: newVehicle.driveTrain,
            powerTrainType: newVehicle.powerTrain,
            engineSize: newVehicle.engineSize,
            power: newVehicle.power,
            torque: newVehicle.torque,
            locationAddress: newVehicle.address,
            features: newVehicle.features,
            price: newVehicle.price,
        })
    };

    console.log(requestOptions.body);
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