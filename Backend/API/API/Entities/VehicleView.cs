using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class VehicleView
    {
        [Key]
        public string Id { get; set; }

        [Required] 
        public string UserID { get; set; }

        [Required]
        public string VehicleID { get; set; }

        public virtual User User { get; set; }
        public virtual Vehicle Vehicle { get; set; }
    }
}
