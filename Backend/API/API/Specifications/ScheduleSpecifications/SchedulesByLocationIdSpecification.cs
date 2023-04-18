using API.Entities;

namespace API.Specifications.ScheduleSpecifications
{
    public class SchedulesByLocationIdSpecification : Specification<Schedule>
    {
        public SchedulesByLocationIdSpecification(string locationId) : base(x => x.LocationId == locationId) { }
    }
}
