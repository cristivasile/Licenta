export enum PowerTrainType {
    Diesel = "Diesel",
    Petrol = "Petrol",
    LPG = "LPG",                        //LPG + petrol
    HydrogenCell = "HydrogenCell",      //FCEV - fuel cell electric vehicle
    FullElectric = "FullElectric",      //BEV - battery electric vehicle
    Hybrid = "Hybrid",                  //HEV
    PlugInHybrid = "PlugInHybrid",      //PHEV 
    MildHybrid = "MildHybrid"           //MHEV
}

export const PowerTrainsMap: Map<string, PowerTrainType> = new Map([
    ["Diesel", PowerTrainType.Diesel] as [string, PowerTrainType],
    ["Petrol", PowerTrainType.Petrol] as [string, PowerTrainType],
    ["LPG", PowerTrainType.LPG] as [string, PowerTrainType],
    ["Hydrogen cell (FCEV)", PowerTrainType.HydrogenCell] as [string, PowerTrainType],
    ["Full electric (BEV)", PowerTrainType.FullElectric] as [string, PowerTrainType],
    ["Hybrid (HEV)", PowerTrainType.Hybrid] as [string, PowerTrainType],
    ["Plug in hybrid (PHEV)", PowerTrainType.PlugInHybrid] as [string, PowerTrainType],
    ["MildHybrid (MHEV)", PowerTrainType.MildHybrid] as [string, PowerTrainType],
]);