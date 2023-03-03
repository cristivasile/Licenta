using API.Entities;
using API.Models.Input;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class DetailedVehicleModel : VehicleWithFeaturesModel
    {
        public StatusModel Status { get; set; }

        public DetailedVehicleModel(Vehicle ob, Dictionary<int, List<FeatureModel>> groupedFeatures) : base(ob, groupedFeatures)
        {
            if (ob.Status != null)
            {
                Status = new(ob.Status);
            }
        }
    }
}
