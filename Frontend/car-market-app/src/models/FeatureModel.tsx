export interface FeatureModel {
    id: string,
    name: string,
    desirability: number
};

export function mapJsonToFeatureModels(json: any): FeatureModel[] {
    var featureList = new Array<FeatureModel>();

    if (json != null) {
        json.forEach(function (value: any) {
            featureList.push({
                id: value.id,
                name: value.name,
                desirability: value.desirability
            } as FeatureModel);
        });
    }

    return featureList;
}