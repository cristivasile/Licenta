import { apiUrl } from "../constants";
import { DriveTrainTypeEnum } from "../models/DriveTrainTypeEnum";
import { PowerTrainTypeEnum } from "../models/PowerTrainTypeEnum";
import { SortTypeEnum } from "../models/SortTypeEnumModel";
import { TransmissionTypeEnum } from "../models/TransmissionTypeEnum";
import { store } from "../redux/store";
import { authenticatedFetch } from "./fetchInterceptor";

export interface VehicleCreateModel {
    image: string,
    thumbnailImage: string,
    brand: string,
    model: string,
    bodyType: string,
    description: string,
    address: string,
    odometer: number,
    year: number,
    driveTrain: DriveTrainTypeEnum,
    powerTrain: PowerTrainTypeEnum,
    transmission: TransmissionTypeEnum,
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
        headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
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

export interface VehicleFiltersModel {
    startAt: number,
    numberToGet: number,
    brand: string | null,
    model: string | null,
    bodyType: string | null,
    maxMileage: number | null,
    minPrice: number | null,
    maxPrice: number | null,
    minYear: number | null,
    sort: SortTypeEnum | null,
    sortAsc: boolean,
}

export const getAvailableVehicles = (filters: VehicleFiltersModel): Promise<Response> => {

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
            minYear: filters.minYear,
            sort: filters.sort,
            sortAsc: filters.sortAsc,
        })
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