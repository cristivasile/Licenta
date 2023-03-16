export interface BodyTypeModel {
    name: string,
};

export function jsonToBodyTypeModel(json:any) : BodyTypeModel {
    return {
        name: json.name,
    } as BodyTypeModel;
}

export function mapJsonToBodyTypeModels(json: any): BodyTypeModel[] {
    var featureList = new Array<BodyTypeModel>();

    if (json != null) {
        json.forEach(function (value: any) {
            featureList.push(
                jsonToBodyTypeModel(value)
            );
        });
    }

    return featureList;
}