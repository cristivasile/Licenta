using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class LocationModel : LocationCreateModel
    {
        public LocationModel(Location ob)
        {
            this.Address = ob.Address;
        }
    }
}
