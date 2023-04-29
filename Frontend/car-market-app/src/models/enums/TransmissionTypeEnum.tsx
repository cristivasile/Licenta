export enum TransmissionTypeEnum {
    Manual = "Manual",
    Semi_automatic = "Semi_automatic",
    Automatic = "Automatic",
}

export const transmissionTypeEnumMap: Map<string, TransmissionTypeEnum>  = new Map([
    ["Manual", TransmissionTypeEnum.Manual] as [string, TransmissionTypeEnum],
    ["Semi-automatic", TransmissionTypeEnum.Semi_automatic] as [string, TransmissionTypeEnum],
    ["Automatic", TransmissionTypeEnum.Automatic] as [string, TransmissionTypeEnum],
]);