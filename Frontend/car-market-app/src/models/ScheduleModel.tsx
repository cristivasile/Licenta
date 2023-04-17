import { WeekdayEnum } from "./WeekdayEnum";

export interface ScheduleModel{
    weekday: WeekdayEnum,
    openingTime: string,
    closingTime: string,
}

export function jsonToScheduleModel(json:any) : ScheduleModel {
    return {
        weekday: json.weekday,
        openingTime: json.openingTime.slice(0, -3), //remove :00 for seconds
        closingTime: json.closingTime.slice(0, -3), //remove :00 for seconds
    } as ScheduleModel;
}

export function mapJsonToScheduleModels(json: any): ScheduleModel[] {
    var schedulesList = new Array<ScheduleModel>();

    if (json != null) {
        json.forEach(function (value: any) {
            schedulesList.push(
                jsonToScheduleModel(value)
            );
        });
    }

    return schedulesList;
}