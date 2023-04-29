export enum PowerTrainTypeEnum {
    Diesel = "Diesel",
    Petrol = "Petrol",
    LPG = "LPG",                        //LPG + petrol
    HydrogenCell = "HydrogenCell",      //FCEV - fuel cell electric vehicle
    FullElectric = "FullElectric",      //BEV - battery electric vehicle
    Hybrid = "Hybrid",                  //HEV
    PlugInHybrid = "PlugInHybrid",      //PHEV 
    MildHybrid = "MildHybrid"           //MHEV
}

export const powerTrainEnumMap: Map<string, PowerTrainTypeEnum> = new Map([
    ["Diesel", PowerTrainTypeEnum.Diesel] as [string, PowerTrainTypeEnum],
    ["Petrol", PowerTrainTypeEnum.Petrol] as [string, PowerTrainTypeEnum],
    ["LPG", PowerTrainTypeEnum.LPG] as [string, PowerTrainTypeEnum],
    ["Hydrogen cell (FCEV)", PowerTrainTypeEnum.HydrogenCell] as [string, PowerTrainTypeEnum],
    ["Full electric (BEV)", PowerTrainTypeEnum.FullElectric] as [string, PowerTrainTypeEnum],
    ["Hybrid (HEV)", PowerTrainTypeEnum.Hybrid] as [string, PowerTrainTypeEnum],
    ["Plug in hybrid (PHEV)", PowerTrainTypeEnum.PlugInHybrid] as [string, PowerTrainTypeEnum],
    ["MildHybrid (MHEV)", PowerTrainTypeEnum.MildHybrid] as [string, PowerTrainTypeEnum],
]);