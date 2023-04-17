using API.Entities;

namespace API.Specifications.AppointmentTypeSpecifications
{
    public class AppointmentTypesByLocationIdSpecification : Specification<AppointmentType>
    {
        public AppointmentTypesByLocationIdSpecification(string locationId) : base(x => x.LocationId == locationId) { }
    }
}
