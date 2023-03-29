using API.Entities;
using System.Collections.Generic;

namespace API.Models.Return
{
    public abstract class VehicleWithFeaturesModel : VehicleModel
    {
        public string Description { get; set; }
        public LocationModel Location { get; set; }
        public List<FeatureModel> Features { get; set; }
        public VehicleWithFeaturesModel(Vehicle ob) : base(ob)
        {
            Description = ob.Description;

            if (ob.Location != null)
                Location = new(ob.Location);

            Features = new();
            foreach(var feature in ob.Features)
                Features.Add(new(feature));
        }
    }
}
