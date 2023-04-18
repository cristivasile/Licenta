using API.Entities;

namespace API.Specifications.ScheduleSpecifications
{
    public class ScheduleByLocationIdAndWeekdaySpecification : Specification<Schedule>
    {
        public ScheduleByLocationIdAndWeekdaySpecification(string locationId, WeekdayEnum weekday) 
            : base(x => x.LocationId == locationId && x.Weekday == weekday) { }
    }
}
