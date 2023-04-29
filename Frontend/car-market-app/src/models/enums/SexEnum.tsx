export enum SexEnum
{
    Male = "Male",      
    Female = "Female",    
}
export const sexEnumMap: Map<string, SexEnum>  = new Map([
    ["Male", SexEnum.Male] as [string, SexEnum],
    ["Female", SexEnum.Female] as [string, SexEnum]
]);