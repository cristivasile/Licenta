using API.Entities;
using System;
using System.Security.Cryptography.X509Certificates;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentsByUserIdAndVehicleIdSpecification : Specification<Appointment>
    {
        public AppointmentsByUserIdAndVehicleIdSpecification(string userId, string vehicleId, bool upcoming)
            : base(x => x.UserId == userId && x.VehicleId == vehicleId && (!upcoming || x.Date > DateTime.Now))
        {
            SplitQuery = true;

            AddInclude(x => x.User);
            AddInclude(x => x.AppointmentType);
            AddInclude(x => x.Vehicle);
            AddInclude(x => x.Vehicle.Location);
        }
    }
}
