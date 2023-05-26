using API.Entities;

namespace API.Specifications.ScheduleSpecifications
{
    public class ScheduleByWeekdaySpecification : Specification<Schedule>
    {
        public ScheduleByWeekdaySpecification(WeekdayEnum weekday) 
            : base(x => x.Weekday == weekday) { }
    }
}
