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
        public float EngineSize { get; set; }
        public int Year { get; set; }
        public float Price { get; set; }

        public VehicleModel(Vehicle ob)
        {
            Id = ob.Id;
            Brand = ob.Brand;
            Model = ob.Model;
            BodyType = ob.BodyTypeName;
            Odometer = ob.Odometer;
            Power = ob.Power;
            EngineSize = ob.EngineSize;
            Price = ob.Price;
            Year = ob.Year;

            if (ob.Image != null)
                Image = ob.Image;
        }
    }
}
