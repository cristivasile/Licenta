import { DriveTrainTypeEnum } from "./DriveTrainTypeEnum";
import { jsonToLocationModel, LocationModel } from "./LocationModel";
import { PowerTrainTypeEnum } from "./PowerTrainTypeEnum";
import { TransmissionTypeEnum } from "./TransmissionTypeEnum";

export interface SimplifiedVehicleModel {
    id: string,
    thumbnail: string,
    brand: string,
    model: string,
    bodyType: string,
    odometer: number,
    year: number,
    engineSize: number,
    power: number,
    torque: number,
    price: number,
    transmissionType: string,
    isSold: boolean,
};

export interface StatusModel{
    isSold: boolean,
    dateAdded: Date,
    dateSold: Date | null,
    purchasedBy: string | null,
}

export interface FeatureModel{
    id: string,
    name: string,
}

export interface DetailedVehicleModel {
    id: string,
    thumbnail: string,
    images: string[],
    brand: string,
    model: string,
    bodyType: string,
    odometer: number,
    year: number,
    engineSize: number | null,
    power: number,
    torque: number,
    price: number,
    powerTrainType: string,
    driveTrainType: string,
    transmissionType: string,
    description: string,
    location: LocationModel,
    features: FeatureModel[],
    status: StatusModel,
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
    minPower: number | null,
    maxPower: number | null,
    minYear: number | null,
    transmissionType: string | null,
    sort: string | null,
    sortAsc: boolean,
}

export interface VehicleCreateModel {
    images: string[],
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

export interface VehicleSaleModel{
    username: string | null,
    isSold: boolean,
}

export function mapJsonToShortVehicleModels(json: any): SimplifiedVehicleModel[] {
    var vehicleList = new Array<SimplifiedVehicleModel>();

    if (json !== null) {
        json.forEach(function (value: any) {
            vehicleList.push({
                id: value.id,
                thumbnail: value.thumbnail,
                brand: value.brand,
                model: value.model,
                bodyType: value.bodyType,
                odometer: value.odometer,
                year: value.year,
                engineSize: value.engineSize,
                power: value.power,
                torque: value.torque,
                transmissionType: value.transmissionType,
                price: value.price,
                isSold: value.isSold,
            } as SimplifiedVehicleModel);
        });
    }
    return vehicleList;
}

export function mapJsonToDetailedVehicleModel(json: any): DetailedVehicleModel{
    function mapJsonToStatusModel(json: any): StatusModel{
        return {
            isSold: json.isSold,
            dateAdded: json.dateAdded,
            dateSold: json.dateSold,
            purchasedBy: json.purchasedBy,
        } as StatusModel;
    }

    function mapJsonToFeaturesModel(json: any): FeatureModel[]{
        var featureList = new Array<FeatureModel>();

        if (json !== null) {
            json.forEach(function (value: any) {
                featureList.push({
                    id: value.id,
                    name: value.name,
                } as FeatureModel);
            });
        }
        return featureList;
    }

    var detailedVehicle = {
        id: json.id,
        thumbnail: json.thumbnail,
        images: new Array<string>(), //images are returned through a separate query
        brand: json.brand,
        model: json.model,
        bodyType: json.bodyType,
        odometer: json.odometer,
        year: json.year,
        engineSize: json.engineSize,
        power: json.power,
        torque: json.torque,
        powerTrainType: json.powerTrainType,
        driveTrainType: json.driveTrainType,
        description: json.description,
        location: jsonToLocationModel(json.location),
        transmissionType: json.transmissionType,
        price: json.price,
        features: mapJsonToFeaturesModel(json.features),
        status: mapJsonToStatusModel(json.status),
    } as DetailedVehicleModel;

    if(detailedVehicle.images.length === 0 && json.thumbnail.length !== 0){
        detailedVehicle.images.push(json.thumbnail);
        }

    return detailedVehicle;
}

