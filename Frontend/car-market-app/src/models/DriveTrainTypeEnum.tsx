export enum DriveTrainType {
    FWD = "FWD",
    RWD = "RWD",
    AWD = "AWD",
    FourWD = "FourWD"    //4WD, 4x4
}

export const getDriveTrainsMap: Map<string, DriveTrainType>  = new Map([
    ["Front wheel drive", DriveTrainType.FWD] as [string, DriveTrainType],
    ["Rear wheel drive", DriveTrainType.RWD] as [string, DriveTrainType],
    ["All wheel drive", DriveTrainType.AWD] as [string, DriveTrainType],
    ["Four wheel drive", DriveTrainType.FourWD] as [string, DriveTrainType],
]);