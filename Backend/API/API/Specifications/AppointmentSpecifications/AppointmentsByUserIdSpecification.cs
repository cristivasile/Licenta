using API.Entities;
using System;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentsByUserIdSpecification : Specification<Appointment>
    {
        public AppointmentsByUserIdSpecification(string userId, bool upcoming) 
            : base(x => x.UserId == userId && (!upcoming || x.Date > DateTime.Now))
        {
            SplitQuery = true;

            AddInclude(x => x.User);
            AddInclude(x => x.AppointmentType);
            AddInclude(x => x.Vehicle);
            AddInclude(x => x.Vehicle.Location);
        }
    }
}
