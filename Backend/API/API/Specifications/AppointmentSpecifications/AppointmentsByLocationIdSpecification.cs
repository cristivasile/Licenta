using API.Entities;
using System;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentsByLocationIdSpecification : Specification<Appointment>
    {
        public AppointmentsByLocationIdSpecification(string locationId) 
            : base(x => x.Vehicle.LocationId == locationId)
        {
            SplitQuery = true;

            AddInclude(x => x.User);
            AddInclude(x => x.AppointmentType);
            AddInclude(x => x.Vehicle);
            AddInclude(x => x.Vehicle.Location);
        }
    }
}
