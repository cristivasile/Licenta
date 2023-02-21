using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Entities
{
    public class VehicleFeature
    {
        public string VehicleId { get; set; }
        public string FeatureId { get; set; }
        /// <summary>
        /// Referenced vehicle.
        /// </summary>
        public virtual Vehicle Vehicle { get; set; }
        /// <summary>
        /// Referenced feature.
        /// </summary>
        public virtual Feature Feature { get; set; }
    }
}
