using API.Entities;
using System.Collections.Generic;

namespace API.Models.Return
{
    public abstract class VehicleWithFeaturesModel : VehicleModel
    {
        public string Description { get; set; }
        public string LocationAddress { get; set; }
        public List<FeatureModel> Features { get; set; }

        public VehicleWithFeaturesModel(Vehicle ob) : base(ob)
        {
            Description = ob.Description;

            if(ob.Location != null)
                LocationAddress = ob.Location.City + ", " + ob.Location.Address;

            if (ob.Images != null)   //'upgrade' image from thumbnail to full-size
                foreach (var image in ob.Images)
                    Image = image.Base64Image;

            Features = new();
            foreach(var feature in ob.Features)
                Features.Add(new(feature));
        }
    }
}
