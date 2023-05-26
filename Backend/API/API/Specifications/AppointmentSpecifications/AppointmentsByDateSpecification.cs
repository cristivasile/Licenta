using API.Entities;
using System;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentsByDateSpecification : Specification<Appointment>
    {
        public AppointmentsByDateSpecification(DateTime date)
            : base(x => x.Date.Date == date.Date)
        {
            SplitQuery = true;

            AddInclude(x => x.Vehicle);
            AddInclude(x => x.Vehicle.Location);
            AddInclude(x => x.AppointmentType);
        }
    }
}
