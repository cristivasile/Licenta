using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Feature
    {
        public string Id { get; set; }
        public string Name { get; set; }

        /// <example>
        /// 1 - Low, 3 - High
        /// </example>
        public int Desirability { get; set; }

        /// <summary>
        /// All vehicles that have this feature.
        /// </summary>
        public virtual ICollection<VehicleFeature> FeatureVehicles { get; set; }
    }
}
