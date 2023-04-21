using System;

namespace API.Models.Input
{
    public class AppointmentCreateModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public DateTime Date { get; set; }
        public string VehicleId { get; set; }
        public string AppointmentTypeId { get; set; }

    }
}
