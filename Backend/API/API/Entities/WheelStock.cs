using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Entities
{
    public class WheelStock
    {
        public string LocationId { get; set; }
        public string WheelId { get; set; }
        /// <summary>
        /// Number of wheels at the location.
        /// </summary>
        public int Stock { get; set; }

        public virtual Location Location { get; set; }
        public virtual Wheel Wheel { get; set; }
        
    }
}
