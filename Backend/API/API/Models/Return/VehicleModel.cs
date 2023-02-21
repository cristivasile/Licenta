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

        public VehicleModel(Vehicle x)
        {
            Id = x.Id;
            Brand = x.Brand;
            Model = x.Model;
            LocationAddress = x.LocationAddress;

            if(x.Location != null)
                LocationAddress = x.Location.Address;

            if (x.Image != null)
                Image = x.Image;

            if (x.Status != null)
            {
                Status = x.Status;
                Status.Vehicle = null;
            }

            Odometer = x.Odometer;
            Power = x.Power;
            EngineSize = x.EngineSize;
            Price = x.Price;
            Year = x.Year;
        }
    }
}
