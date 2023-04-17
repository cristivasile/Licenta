using API.Entities;
using API.Models.Input;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class LocationModel : LocationCreateModel
    {
        public string Id;
        public LocationModel(Location ob)
        {
            Id = ob.Id;
            City = ob.City;
            Address = ob.Address;

            List<ScheduleModel> schedules = new();

            if(ob.Schedules != null)
                foreach (var schedule in ob.Schedules)
                    schedules.Add(new ScheduleModel()
                    {
                        Weekday = schedule.Weekday,
                        OpeningTime = schedule.OpeningTime.ToString(),
                        ClosingTime = schedule.ClosingTime.ToString(),
                    });

            Schedules = schedules;
        }
    }
}
