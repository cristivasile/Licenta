import { apiUrl } from "../constants";
import { VehicleCreateModel, VehicleFiltersModel } from "../models/VehicleModel";
import { store } from "../redux/store";
import { isAdmin } from "./authenticationService";
import { authenticatedFetch } from "./fetchInterceptor";

export const createVehicle = (newVehicle: VehicleCreateModel): Promise<Response> => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
        body: JSON.stringify({
            images: newVehicle.images,
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
            transmissionType: newVehicle.transmission,
            engineSize: newVehicle.engineSize,
            power: newVehicle.power,
            torque: newVehicle.torque,
            locationAddress: newVehicle.address,
            features: newVehicle.features,
            price: newVehicle.price,
        })
    };

    return authenticatedFetch(apiUrl + "/api/Vehicle", requestOptions);
}

export const updateVehicle = (id: string, updatedVehicle: VehicleCreateModel): Promise<Response> => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
        body: JSON.stringify({
            images: updatedVehicle.images,
            thumbnailImage: updatedVehicle.thumbnailImage,
            brand: updatedVehicle.brand,
            model: updatedVehicle.model,
            bodyType: updatedVehicle.bodyType,
            description: updatedVehicle.description,
            odometer: updatedVehicle.odometer,
            locationId: updatedVehicle.locationId,
            year: updatedVehicle.year,
            driveTrainType: updatedVehicle.driveTrain,
            powerTrainType: updatedVehicle.powerTrain,
            transmissionType: updatedVehicle.transmission,
            engineSize: updatedVehicle.engineSize,
            power: updatedVehicle.power,
            torque: updatedVehicle.torque,
            locationAddress: updatedVehicle.address,
            features: updatedVehicle.features,
            price: updatedVehicle.price,
        })
    };

    return authenticatedFetch(apiUrl + "/api/Vehicle/" + id, requestOptions);
}

export const updateVehicleImages = (id: string, updatedImages: string[]): Promise<Response> => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
        body: JSON.stringify(
            updatedImages
        )
    };

    return authenticatedFetch(apiUrl + "/api/Vehicle/updateImages/" + id, requestOptions);
}

export const getVehiclesList = (filters: VehicleFiltersModel): Promise<Response> => {
    var userIsAdmin: boolean = isAdmin(store.getState().user.role as string);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
        body: JSON.stringify({
            startAt: filters.startAt,
            numberToGet: filters.numberToGet,
            brand: filters.brand,
            model: filters.model,
            bodyType: filters.bodyType,
            maxMileage: filters.maxMileage,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minPower: filters.minPower,
            maxPower: filters.maxPower,
            minYear: filters.minYear,
            transmission: filters.transmissionType,
            sort: filters.sort,
            sortAsc: filters.sortAsc,
        })
    };

    //regular users can only get still available vehicles
    if (!userIsAdmin){
        var endpoint = apiUrl + "/api/Vehicle/getAvailable";
        return fetch(endpoint, requestOptions);
    }
    else{
        endpoint = apiUrl + "/api/Vehicle/getAll"; 
        return authenticatedFetch(endpoint, requestOptions);
    }
}

export const getVehicleById = (id: string): Promise<Response> => {
    var userIsAdmin: boolean = isAdmin(store.getState().user.role as string);
    
    //regular users have a more restrictive fetch
    var endpoint = apiUrl + "/api/Vehicle/";
    if (userIsAdmin)
        endpoint = endpoint + "admin/"; 

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    };

    return authenticatedFetch(endpoint + id, requestOptions);
}

export const getImagesByVehicleId = (id: string): Promise<Response> => {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    };

    return authenticatedFetch(apiUrl + "/api/Picture/getVehicleImages/" + id, requestOptions);
}

export const getVehicleTypesDictionary = (): Promise<Response> => {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    };
    return fetch(apiUrl + "/api/Vehicle/getBrandModelDictionary", requestOptions);
}

export const sellVehicle = (id: string, username: string | null, isSold: boolean): Promise<Response> => {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
        body: JSON.stringify({
            username: username,
            isSold: isSold,
        })
    };

    return authenticatedFetch(apiUrl + "/api/Vehicle/setSold/" + id, requestOptions);
}