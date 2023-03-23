import { apiUrl } from "../constants";
import { VehicleCreateModel, VehicleFiltersModel } from "../models/VehicleModel";
import { store } from "../redux/store";
import { isAdmin } from "./authenticationService";
import { authenticatedFetch } from "./fetchInterceptor";

export const postVehicle = (newVehicle: VehicleCreateModel): Promise<Response> => {

    console.log(newVehicle);
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

    console.log(requestOptions.body);
    return authenticatedFetch(apiUrl + "/api/Vehicle", requestOptions);
}

export const getVehiclesList = (filters: VehicleFiltersModel): Promise<Response> => {
    var userIsAdmin: boolean = isAdmin(store.getState().user.role as string);

    //regular users can only get still available vehicles
    var endpoint = apiUrl + "/api/Vehicle/getAvailable";
    if (userIsAdmin)
        endpoint = apiUrl + "/api/Vehicle/getAll"; 

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
    return authenticatedFetch(endpoint, requestOptions);
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

export const getVehicleTypesDictionary = (): Promise<Response> => {

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
    };
    return authenticatedFetch(apiUrl + "/api/Vehicle/getBrandModelDictionary", requestOptions);
}