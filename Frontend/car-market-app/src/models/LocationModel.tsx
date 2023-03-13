export interface LocationModel {
    id: string,
    city: string,
    address: string
};

export function jsonToLocationModel(json:any) : LocationModel {
    return {
        id: json.id,
        city: json.city,
        address: json.address
    } as LocationModel;
}

export function mapJsonToLocationModels(json: any): LocationModel[] {
    var locationsList = new Array<LocationModel>();

    if (json != null) {
        json.forEach(function (value: any) {
            locationsList.push(
                jsonToLocationModel(value)
            );
        });
    }

    return locationsList;
}