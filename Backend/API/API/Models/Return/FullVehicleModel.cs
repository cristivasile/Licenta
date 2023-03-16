using API.Entities;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class FullVehicleModel : VehicleWithFeaturesModel
    {
        public FullStatusModel Status { get; set; }

        public FullVehicleModel(Vehicle ob) : base(ob)
        {
            if (ob.Status != null)
            {
                Status = new(ob.Status);
            }
        }
    }
}
