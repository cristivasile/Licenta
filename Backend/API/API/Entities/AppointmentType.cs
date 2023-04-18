using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class AppointmentType : Entity
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public uint Duration { get; set; }
        [Required]
        public string LocationId { get; set; }
        public virtual Location Location { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
    }
}
