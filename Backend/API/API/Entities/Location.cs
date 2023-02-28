using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Location : Entity
    {
        [Key]
        public string Address { get; set; }
        /// <summary>
        /// All vehicles for sale by this dealership.
        /// </summary>
        public virtual ICollection<Vehicle> OwnedVehicles { get; set; }
        
    }
}
