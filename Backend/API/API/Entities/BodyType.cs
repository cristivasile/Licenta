using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class BodyType : Entity
    {
        [Key]
        public string Name { get; set; }
        /// <summary>
        /// All vehicles that have this body type
        /// </summary>
        public virtual ICollection<Vehicle> Vehicles { get; set; }
    }
}
