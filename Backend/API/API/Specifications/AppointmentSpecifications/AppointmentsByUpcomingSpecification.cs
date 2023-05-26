using API.Entities;
using System;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentsByUpcomingSpecification : Specification<Appointment>
    {
        public AppointmentsByUpcomingSpecification(bool upcoming)
            : base(x => !upcoming || x.Date > DateTime.Now)
        {
            SplitQuery = true;

            AddInclude(x => x.User);
            AddInclude(x => x.AppointmentType);
            AddInclude(x => x.Vehicle);
            AddInclude(x => x.Vehicle.Location);
        }
    }
}
