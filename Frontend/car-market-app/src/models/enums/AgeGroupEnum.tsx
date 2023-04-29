export enum AgeGroupEnum
{
    Young = "Young",        //18 - 39
    Middle = "Middle",      //40 - 59
    Old = "Old",            //60+
}
export const ageGroupEnumMap: Map<string, AgeGroupEnum>  = new Map([
    ["18 - 39", AgeGroupEnum.Young] as [string, AgeGroupEnum],
    ["40 - 59", AgeGroupEnum.Middle] as [string, AgeGroupEnum],
    ["60+", AgeGroupEnum.Old] as [string, AgeGroupEnum],
]);