using API.Entities;
using API.Models.Input;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class VehicleModel
    {
        public string Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Image { get; set; }
        public string BodyType { get; set; }
        public int Odometer { get; set; }
        public int Power { get; set; }
        public int Torque { get; set; }
        public int? EngineSize { get; set; }
        public int Year { get; set; }
        public float Price { get; set; }
        public PowerTrainTypeEnum PowerTrainType { get; set; }
        public DriveTrainTypeEnum DriveTrainType { get; set; }
        public TransmissionEnum TransmissionType { get; set; }

        public VehicleModel(Vehicle ob)
        {
            Id = ob.Id;
            Brand = ob.Brand;
            Model = ob.Model;
            BodyType = ob.BodyTypeName;
            Odometer = ob.Odometer;
            Power = ob.Power;
            Torque = ob.Torque;
            EngineSize = ob.EngineSize;
            Price = ob.Price;
            Year = ob.Year;
            PowerTrainType = ob.PowerTrainType;
            DriveTrainType = ob.DriveTrainType;
            TransmissionType = ob.TransmissionType;

            if (ob.ThumbnailImage != null)
                Image = ob.ThumbnailImage;
        }
    }
}
