using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class WheelCreateModel
    {
        public string Width { get; set; }
        public string Diameter { get; set; }
        public string BoltPattern { get; set; }
        public string Weight { get; set; }
        public string Material { get; set; }
        public float Price { get; set; }
    }
}
