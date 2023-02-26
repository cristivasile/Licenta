using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Vehicle : Entity
    {
        public string Id { get; set; }
        public string Image { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Description { get; set; }
        public int Odometer { get; set; }
        public int Year { get; set; }
        public float EngineSize { get; set; }
        public int Power { get; set; }
        public float Price { get; set; }
        public string LocationAddress { get; set; }
        public virtual Location Location { get; set; }
        public virtual Status Status { get; set; }
        /// <summary>
        /// All features belonging to this vehicle.
        /// </summary>
        public virtual ICollection<Feature> Features { get; set; }
    }
}

