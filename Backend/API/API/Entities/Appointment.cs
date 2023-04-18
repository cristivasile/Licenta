using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Appointment : Entity
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Phone { get; set; }
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string VehicleId { get; set; }  
        public virtual Vehicle Vehicle { get; set; }

        [Required]
        public string AppointmentTypeId { get; set; }
        public virtual AppointmentType AppointmentType { get; set; }

        [Required]
        public string UserId { get; set; }
        public virtual User User { get; set; }
    }
}
