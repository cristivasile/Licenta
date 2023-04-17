using API.Entities;

namespace API.Specifications.ScheduleSpecifications
{
    public class ScheduleByLocationIdSpecification : Specification<Schedule>
    {
        public ScheduleByLocationIdSpecification(string locationId) : base(x => x.LocationId == locationId) { }
    }
}
