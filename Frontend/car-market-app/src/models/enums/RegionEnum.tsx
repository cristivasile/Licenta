export enum RegionEnum
{
    Urban = "Urban",
    Rural = "Rural"
}
export const regionEnumMap: Map<string, RegionEnum>  = new Map([
    ["Urban", RegionEnum.Urban] as [string, RegionEnum],
    ["Rural", RegionEnum.Rural] as [string, RegionEnum]
]);