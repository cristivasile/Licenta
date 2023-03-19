export enum DriveTrainTypeEnum {
    FWD = "FWD",
    RWD = "RWD",
    AWD = "AWD",
    FourWD = "FourWD"    //4WD, 4x4
}

export const driveTrainsMap: Map<string, DriveTrainTypeEnum>  = new Map([
    ["Front wheel drive", DriveTrainTypeEnum.FWD] as [string, DriveTrainTypeEnum],
    ["Rear wheel drive", DriveTrainTypeEnum.RWD] as [string, DriveTrainTypeEnum],
    ["All wheel drive", DriveTrainTypeEnum.AWD] as [string, DriveTrainTypeEnum],
    ["Four wheel drive", DriveTrainTypeEnum.FourWD] as [string, DriveTrainTypeEnum],
]);