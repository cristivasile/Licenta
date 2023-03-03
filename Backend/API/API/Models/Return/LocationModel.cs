using API.Entities;
using API.Models.Input;

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
