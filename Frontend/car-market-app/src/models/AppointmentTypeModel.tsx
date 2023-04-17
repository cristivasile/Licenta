export interface AppointmentTypeModel {
    id: string,
    name: string,
    duration: number,
};

export function jsonToAppointmentTypeModel(json:any) : AppointmentTypeModel {
    return {
        id: json.id,
        name: json.name,
        duration: json.duration,
    } as AppointmentTypeModel;
}

export function mapJsonToAppointmentTypeModels(json: any): AppointmentTypeModel[] {
    var appointmentTypeList = new Array<AppointmentTypeModel>();

    if (json != null) {
        json.forEach(function (value: any) {
            appointmentTypeList.push(
                jsonToAppointmentTypeModel(value)
            );
        });
    }

    return appointmentTypeList;
}