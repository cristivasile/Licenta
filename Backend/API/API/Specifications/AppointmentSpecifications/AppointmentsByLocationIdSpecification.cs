using API.Entities;
using System;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentsByLocationIdSpecification : Specification<Appointment>
    {
        public AppointmentsByLocationIdSpecification(string locationId, bool upcoming) 
            : base(x => x.Vehicle.LocationId == locationId && (!upcoming || x.Date > DateTime.Now))
        {
            SplitQuery = true;

            AddInclude(x => x.User);
            AddInclude(x => x.AppointmentType);
            AddInclude(x => x.Vehicle);
            AddInclude(x => x.Vehicle.Location);
        }
    }
}
