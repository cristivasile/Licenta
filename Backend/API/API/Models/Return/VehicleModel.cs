using API.Entities;
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
        public Status Status { get; set; }
        public VehicleModel(Vehicle ob)
        {
            Id = ob.Id;
            //TODO - fix vehicles
            //Brand = ob.Brand;
            //Model = ob.Model;
            Description = ob.Description;
            LocationAddress = ob.LocationAddress;

            if(ob.Location != null)
                LocationAddress = ob.Location.Address;

            if (ob.Image != null)
                Image = ob.Image;

            if (ob.Status != null)
            {
                Status = ob.Status;
                Status.Vehicle = null;
            }

            Odometer = ob.Odometer;
            Power = ob.Power;
            EngineSize = ob.EngineSize;
            Price = ob.Price;
            Year = ob.Year;
        }
    }
}
