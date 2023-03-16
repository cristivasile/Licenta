using API.Entities;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class VehicleWithFeaturesModel : VehicleModel
    {
        public string Description { get; set; }
        public string LocationAddress { get; set; }
        public List<FeatureModel> Features { get; set; }

        public VehicleWithFeaturesModel(Vehicle ob) : base(ob)
        {
            Description = ob.Description;

            if(ob.Location != null)
                LocationAddress = ob.Location.City + ", " + ob.Location.Address;

            if (ob.Image != null)
                Image = ob.Image;

            Odometer = ob.Odometer;
            Power = ob.Power;
            EngineSize = ob.EngineSize;
            Price = ob.Price;
            Year = ob.Year;

            Features = new();
            foreach(var feature in ob.Features)
                Features.Add(new(feature));
        }
    }
}
