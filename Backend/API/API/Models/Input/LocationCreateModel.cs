using System.Collections.Generic;

namespace API.Models.Input
{
    public class LocationCreateModel
    {
        public string City { get; set; }
        public string Address { get; set; }
        public List<ScheduleModel> Schedules { get; set; }
    }
}
