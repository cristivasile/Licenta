using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace API.Entities
{
    [PrimaryKey(nameof(Brand), nameof(Model))]
    public class VehicleType : Entity
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public virtual ICollection<Vehicle> Vehicles { get; set; }
    }
}
