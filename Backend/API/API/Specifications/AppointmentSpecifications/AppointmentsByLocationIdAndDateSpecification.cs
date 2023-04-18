using API.Entities;
using System;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentsByLocationIdAndDateSpecification : Specification<Appointment>
    {
        public AppointmentsByLocationIdAndDateSpecification(string locationId, DateTime date)
            : base(x => x.Vehicle.LocationId == locationId && x.Date.Date == date.Date)
        {
            SplitQuery = true;

            AddInclude(x => x.Vehicle);
            AddInclude(x => x.Vehicle.Location);
        }
    }
}
