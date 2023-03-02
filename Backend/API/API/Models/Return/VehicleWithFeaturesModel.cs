using API.Entities;
using API.Models.Input;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class VehicleWithFeaturesModel : VehicleCreateModel
    {
        public string Id { get; set; }
        public StatusModel Status { get; set; }
        public Dictionary<int, List<FeatureModel>> GroupedFeatures { get; set; }

        public VehicleWithFeaturesModel(Vehicle ob, Dictionary<int, List<FeatureModel>> groupedFeatures)
        {
            Id = ob.Id;
            Brand = ob.Brand;
            Model = ob.Model;
            BodyType = ob.BodyTypeName;
            Description = ob.Description;
            LocationAddress = ob.LocationAddress;

            if (ob.Status != null)
            {
                Status = new(ob.Status);
            }

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
