export interface ShortVehicleModel {
    id: string,
    image: string,
    brand: string,
    model: string,
    bodyType: string,
    odometer: number,
    year: number,
    engineSize: number,
    power: number,
    torque: number,
    price: number,
    transmissionType: number,
    isSold: boolean,
};

export function mapJsonToVehicleModels(json: any): ShortVehicleModel[] {
    var vehicleList = new Array<ShortVehicleModel>();

    if (json !== null) {
        json.forEach(function (value: any) {
            vehicleList.push({
                id: value.id,
                image: value.image,
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
            } as ShortVehicleModel);
        });
    }
    return vehicleList;
}