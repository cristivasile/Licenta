using API.Entities;
using API.Models.Input;

namespace API.Models.Return
{
    public class AppointmentTypeModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public uint Duration { get; set; }
        public AppointmentTypeModel(AppointmentType appointmentType)
        {
            Id = appointmentType.Id;
            Duration = appointmentType.Duration;
            Name = appointmentType.Name;
        }
    }
}
