using API.Entities;
using API.Models.Return;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class VehicleWithFeaturesModel : VehicleCreateModel
    {
        public string Id { get; set; }
        public StatusModel Status { get; set; }
        public Dictionary<int, List<FeatureModel>> GroupedFeatures { get; set; }

        public VehicleWithFeaturesModel(Vehicle ob, Dictionary<int, List<FeatureModel>> groupedFeatures)
        {
            Id = ob.Id;
            //TODO - fix vehicles
            //Brand = ob.Brand;
            //Model = ob.Model;
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
