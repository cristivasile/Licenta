export interface BodyTypeModel {
    name: string,
};

export function jsonToBodyTypeModel(json:any) : BodyTypeModel {
    return {
        name: json,
    } as BodyTypeModel;
}

export function mapJsonToBodyTypeModels(json: any): BodyTypeModel[] {
    var bodyTypeList = new Array<BodyTypeModel>();

    if (json != null) {
        json.forEach(function (value: any) {
            bodyTypeList.push(
                jsonToBodyTypeModel(value)
            );
        });
    }

    return bodyTypeList;
}