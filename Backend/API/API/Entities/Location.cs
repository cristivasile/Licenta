using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Location : Entity
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string City { get; set; }
        [Required]
        public string Address { get; set; }
        /// <summary>
        /// All vehicles for sale at this location;
        /// </summary>
        public virtual ICollection<Vehicle> OwnedVehicles { get; set; }
        
    }
}
