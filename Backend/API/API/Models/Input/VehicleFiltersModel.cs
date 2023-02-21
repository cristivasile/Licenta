using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class VehicleFiltersModel
    {
        public string Brand { get; set; }
        public int MaxMileage { get; set; }
        public int MaxPrice { get; set; }
        public int MinYear { get; set; }
        public string Sort { get; set; }
        public bool SortAsc { get; set; }
    }
}
