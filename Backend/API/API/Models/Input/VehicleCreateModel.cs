using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class VehicleCreateModel
    {
        public string Image { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string BodyType { get; set; }
        public string Description { get; set; }
        public int Odometer { get; set; }
        public int Year { get; set; }
        public float EngineSize { get; set; }
        public int Power { get; set; }
        public string LocationAddress { get; set; }
        public List<string> Features { get; set; }
        public float Price { get; set; }
    }
}
