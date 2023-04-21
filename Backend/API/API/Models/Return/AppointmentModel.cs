using API.Entities;
using System;

namespace API.Models.Return
{
    public class AppointmentModel
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string VehicleId { get; set; }
        public DateTime Date { get; set; }
        public string AppointmentTypeName { get; set; }
        public uint AppointmentDuration { get; set; }
        public string VehicleBrand { get; set; }
        public string VehicleModel { get; set; }

        public AppointmentModel(Appointment ob)
        {
            Id = ob.Id;

            if (ob.User != null)
                Username = ob.User.UserName;

            FirstName = ob.FirstName;
            LastName = ob.LastName;
            Phone = ob.Phone;
            VehicleId = ob.VehicleId;
            Date = ob.Date;
            
            if (ob.AppointmentType != null)
            {
                AppointmentTypeName = ob.AppointmentType.Name;
                AppointmentDuration = ob.AppointmentType.Duration;
            }

            if (ob.Vehicle != null)
            {
                VehicleBrand = ob.Vehicle.Brand;
                VehicleModel = ob.Vehicle.Model;
            }
        }
    }
}
