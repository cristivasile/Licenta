using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Vehicle : Entity
    {
        [Key]
        public string Id { get; set; }
        public string Description { get; set; }
        [Required]
        public string Image { get; set; }
        [Required]
        public int Odometer { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public float EngineSize { get; set; }
        [Required]
        public int Power { get; set; }
        [Required]
        public float Price { get; set; }

        public virtual Status Status { get; set; }
        /// <summary>
        /// All features belonging to this vehicle.
        /// </summary>
        public virtual ICollection<Feature> Features { get; set; }

        public string Brand { get; set; }
        public string Model { get; set; }
        public virtual VehicleType VehicleType { get; set; }

        public string LocationAddress { get; set; }
        public virtual Location Location { get; set; }

        public string BodyTypeName { get; set; }
        public virtual BodyType BodyType { get; set; }
    }
}

