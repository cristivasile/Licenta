using API.Entities;
using System;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentByIdSpecification : Specification<Appointment>
    {
        public AppointmentByIdSpecification(string id) : base(x => x.Id == id)
        {
        }
    }
}
