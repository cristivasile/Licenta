using API.Entities;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class VehicleWithFeaturesModel : VehicleModel
    {
        public string Description { get; set; }
        public string LocationAddress { get; set; }
        public Dictionary<int, List<FeatureModel>> GroupedFeatures { get; set; }

        public VehicleWithFeaturesModel(Vehicle ob, Dictionary<int, List<FeatureModel>> groupedFeatures) : base(ob)
        {
            Description = ob.Description;

            if(ob.Location != null)
                LocationAddress = ob.Location.City + ", " + ob.Location.Address;

            if (ob.Image != null)
                Image = ob.Image;

            if (groupedFeatures != null)
                GroupedFeatures = groupedFeatures;

            Odometer = ob.Odometer;
            Power = ob.Power;
            EngineSize = ob.EngineSize;
            Price = ob.Price;
            Year = ob.Year;
        }
    }
}
