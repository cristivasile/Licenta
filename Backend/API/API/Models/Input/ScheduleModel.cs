using API.Entities;
using System;

namespace API.Models.Input
{
    public class ScheduleModel
    {
        public WeekdayEnum Weekday { get; set; }
        public string OpeningTime { get; set; }
        public string ClosingTime { get; set; }
    }
}
