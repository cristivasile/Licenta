export enum SortTypeEnum {
    Name = "Name",
    Price = "Price",
    Mileage = "Mileage",
    Power = "Power",
    Recommended = "Recommended",
}

export const sortTypesMap: Map<string, SortTypeEnum>  = new Map([
    ["Alphabetically", SortTypeEnum.Name] as [string, SortTypeEnum],
    ["Mileage", SortTypeEnum.Mileage] as [string, SortTypeEnum],
    ["Power", SortTypeEnum.Power] as [string, SortTypeEnum],
    ["Price", SortTypeEnum.Price] as [string, SortTypeEnum],
]);

export const recommendationSortTypesMap : Map<string, SortTypeEnum>  = new Map([
    ["Recommended", SortTypeEnum.Recommended] as [string, SortTypeEnum],
    ["Alphabetically", SortTypeEnum.Name] as [string, SortTypeEnum],
    ["Mileage", SortTypeEnum.Mileage] as [string, SortTypeEnum],
    ["Power", SortTypeEnum.Power] as [string, SortTypeEnum],
    ["Price", SortTypeEnum.Price] as [string, SortTypeEnum],
]);