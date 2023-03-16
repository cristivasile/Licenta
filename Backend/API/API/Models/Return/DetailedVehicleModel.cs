using API.Entities;
using API.Models.Input;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class DetailedVehicleModel : VehicleWithFeaturesModel
    {
        public StatusModel Status { get; set; }

        public DetailedVehicleModel(Vehicle ob) : base(ob)
        {
            if (ob.Status != null)
            {
                Status = new(ob.Status);
            }
        }
    }
}
