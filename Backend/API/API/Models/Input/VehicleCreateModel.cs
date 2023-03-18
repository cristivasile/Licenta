using API.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Models.Input
{
    public class VehicleCreateModel
    {
        public string Image { get; set; }
        public string ThumbnailImage { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string BodyType { get; set; }
        public string Description { get; set; }
        public int Odometer { get; set; }
        public int Year { get; set; }
        public float EngineSize { get; set; }
        public int Power { get; set; }
        public string LocationId { get; set; }
        public List<string> Features { get; set; }
        public float Price { get; set; }
        public PowerTrainType PowerTrainType { get; set; }
        public DriveTrainType DriveTrainType { get; set; }
    }
}
