using API.Entities;
using API.Models.Return;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Models
{
    public class VehicleModel : VehicleCreateModel
    {
        public string Id { get; set; }
        public StatusModel Status { get; set; }
        public VehicleModel(Vehicle ob)
        {
            Id = ob.Id;

            Brand = ob.Brand;
            Model = ob.Model;
            BodyType = ob.BodyTypeName;
            Description = ob.Description;
            LocationAddress = ob.LocationAddress;

            if(ob.Location != null)
                LocationAddress = ob.Location.Address;

            if (ob.Image != null)
                Image = ob.Image;

            if (ob.Status != null)
                Status = new(ob.Status);

            Odometer = ob.Odometer;
            Power = ob.Power;
            EngineSize = ob.EngineSize;
            Price = ob.Price;
            Year = ob.Year;
        }
    }
}
