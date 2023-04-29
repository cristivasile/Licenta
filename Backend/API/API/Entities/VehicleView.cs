using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class VehicleView : Entity
    {
        [Key]
        public string Id { get; set; }

        [Required] 
        public string UserId { get; set; }

        [Required]
        public string VehicleId { get; set; }
        [Required]
        public DateTime Date { get; set; }

        public virtual User User { get; set; }
        public virtual Vehicle Vehicle { get; set; }
    }
}
