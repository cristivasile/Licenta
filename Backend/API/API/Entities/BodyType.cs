using System.Collections.Generic;

namespace API.Entities
{
    public class BodyType : Entity
    {
        public string Name { get; set; }
        /// <summary>
        /// All vehicles that have this body type
        /// </summary>
        public virtual ICollection<Vehicle> Vehicles { get; set; }
    }
}
