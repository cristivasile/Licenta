export interface AppointmentModel {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    phone: string,
    vehicleId: string,
    date: Date,
    appointmentTypeName: string,
    appointmentDuration: number,
    vehicleBrand: string,
    vehicleModel: string,
};

export interface AppointmentCreateModel {
    firstName: string,
    lastName: string,
    phone: string,
    date: Date,
    vehicleId: string,
    appointmentTypeId: string,
};

export function jsonToAppointmentModel(json:any) : AppointmentModel {
    return {
        id: json.id,
        username: json.username,
        firstName: json.firstName,
        lastName: json.lastName,
        phone: json.phone,
        vehicleId: json.vehicleId,
        date: new Date(json.date),
        appointmentTypeName: json.appointmentTypeName,
        appointmentDuration: json.appointmentDuration,
        vehicleBrand: json.vehicleBrand,
        vehicleModel: json.vehicleModel,
    } as AppointmentModel;
}

export function mapJsonToAppointmentModels(json: any): AppointmentModel[] {
    var appointmentList = new Array<AppointmentModel>();

    if (json != null) {
        json.forEach(function (value: any) {
            appointmentList.push(
                jsonToAppointmentModel(value)
            );
        });
    }

    return appointmentList;
}