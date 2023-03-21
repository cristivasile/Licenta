export enum SortTypeEnum {
    Name = "Name",
    Price = "Price",
    Mileage = "Mileage",
    Power = "Power"
}

export const sortTypesMap: Map<string, SortTypeEnum>  = new Map([
    ["Alphabetically", SortTypeEnum.Name] as [string, SortTypeEnum],
    ["Mileage", SortTypeEnum.Mileage] as [string, SortTypeEnum],
    ["Power", SortTypeEnum.Power] as [string, SortTypeEnum],
    ["Price", SortTypeEnum.Price] as [string, SortTypeEnum],
]);