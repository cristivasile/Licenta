export interface VehicleTypeModel {
    name: string,
    values: string[],
};

export function mapJsonDictToVehicleTypeModels(json: any): VehicleTypeModel[] {
    var vehicleTypeList = new Array<VehicleTypeModel>();

    for (const [key, value] of Object.entries(json)) {
        vehicleTypeList.push({name: key, values: value} as VehicleTypeModel);
      }

    return vehicleTypeList;
}

export function mapFromVehicleTypeList(list: VehicleTypeModel[]): Map<string, string[]>
{
    return new Map(
        list.map(vehicleType => 
            [vehicleType.name, vehicleType.values] as [string, string[]]));
}

