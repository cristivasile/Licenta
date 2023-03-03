using API.Entities;
using static System.Net.Mime.MediaTypeNames;
using System.Collections.Generic;
using API.Models.Input;

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
            LocationAddress = ob.LocationAddress;

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
