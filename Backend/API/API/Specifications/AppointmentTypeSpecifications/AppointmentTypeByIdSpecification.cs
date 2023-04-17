using API.Entities;

namespace API.Specifications.AppointmentTypeSpecifications
{
    public class AppointmentTypeByIdSpecification : Specification<AppointmentType>
    {
        public AppointmentTypeByIdSpecification(string id) : base(x => x.Id == id) { }
    }
}
