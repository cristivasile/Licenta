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

        public VehicleWithFeaturesModel(Vehicle ob, List<Feature> features, List<List<Feature>> groupedFeatures)
        {
            Id = ob.Id;
            Brand = ob.Brand;
            Model = ob.Model;
            Description = ob.Description;
            LocationAddress = ob.LocationAddress;

            if (ob.Status != null)
            {
                Status = ob.Status;
                //avoid including vehicle again in status
                Status.Vehicle = null;
            }

            if (ob.Image != null)
                Image = ob.Image;

            if (features != null)
                Features = features;

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
