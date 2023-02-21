using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class VehicleWithFeaturesModel : VehicleCreateModel
    {
        public string Id { get; set; }
        public Status Status { get; set; }
        new public List<Feature> Features { get; set; }
        public List<List<Feature>> GroupedFeatures { get; set; }

        public VehicleWithFeaturesModel(Vehicle x, List<Feature> features, List<List<Feature>> groupedFeatures)
        {
            Id = x.Id;
            Brand = x.Brand;
            Model = x.Model;
            LocationAddress = x.LocationAddress;

            if (x.Status != null)
            {
                Status = x.Status;
                //avoid including vehicle again in status
                Status.Vehicle = null;
            }

            if (x.Image != null)
                Image = x.Image;

            if (features != null)
                Features = features;

            if (groupedFeatures != null)
                GroupedFeatures = groupedFeatures;

            Odometer = x.Odometer;
            Power = x.Power;
            EngineSize = x.EngineSize;
            Price = x.Price;
            Year = x.Year;
        }
    }
}
