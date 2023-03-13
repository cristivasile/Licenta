export interface FeatureModel {
    id: string,
    name: string,
    desirability: number
};

export function jsonToFeatureModel(json:any) : FeatureModel {
    return {
        id: json.id,
        name: json.name,
        desirability: json.desirability
    } as FeatureModel;
}

export function mapJsonToFeatureModels(json: any): FeatureModel[] {
    var featureList = new Array<FeatureModel>();

    if (json != null) {
        json.forEach(function (value: any) {
            featureList.push(
                jsonToFeatureModel(value)
            );
        });
    }

    return featureList;
}