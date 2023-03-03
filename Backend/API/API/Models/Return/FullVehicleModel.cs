using API.Entities;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class FullVehicleModel : VehicleWithFeaturesModel
    {
        public FullStatusModel Status { get; set; }

        public FullVehicleModel(Vehicle ob, Dictionary<int, List<FeatureModel>> groupedFeatures) : base(ob, groupedFeatures)
        {
            if (ob.Status != null)
            {
                Status = new(ob.Status);
            }
        }
    }
}
