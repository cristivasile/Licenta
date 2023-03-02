using API.Entities;
using API.Models.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Return
{
    public class LocationModel : LocationCreateModel
    {
        public LocationModel(Location ob)
        {
            Address = ob.Address;
        }
    }
}
