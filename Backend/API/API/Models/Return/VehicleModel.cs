using API.Entities;
using API.Models.Input;
using System.Collections.Generic;

namespace API.Models.Return
{
    public class VehicleModel
    {
        public string Id { get; set; }
        public string Image { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string BodyType { get; set; }
        public int Odometer { get; set; }
        public int Year { get; set; }
        public int? EngineSize { get; set; }
        public int Power { get; set; }  
        public int Torque { get; set; }
        public float Price { get; set; }
        public bool IsSold { get; set; }
        public string PowerTrainType { get; set; }
        public string DriveTrainType { get; set; }
        public string TransmissionType { get; set; }

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
            PowerTrainType = ob.PowerTrainType.ToString();
            DriveTrainType = ob.DriveTrainType.ToString();
            TransmissionType = ob.TransmissionType.ToString();

            if (ob.Thumbnail != null)
                Image = ob.Thumbnail.Base64Image;

            if (ob.Status != null)
                IsSold = ob.Status.IsSold;
            else
                IsSold = false;
        }
    }
}
