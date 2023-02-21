import { FeatureModel, mapJsonToFeatureModels } from "./FeatureModel";

export interface VehicleModel {
    id: string,
    image: string,
    brand: string,
    model: string,
    odometer: number,
    year: number,
    engineSize: number,
    power: number,
    address: string,
    price: number,
    features: FeatureModel[]
};

export function mapJsonToVehicleModels(json: any): VehicleModel[] {
    var vehicleList = new Array<VehicleModel>();

    if (json !== null) {
        json.forEach(function (value: any) {
            vehicleList.push({
                id: value.id,
                image: value.image,
                brand: value.brand,
                model: value.model,
                odometer: value.odometer,
                year: value.year,
                engineSize: value.engineSize,
                power: value.power,
                address: value.locationAddress,
                price: value.price,
                features: mapJsonToFeatureModels(value.features)
            } as VehicleModel);
        });
    }
    return vehicleList;
}