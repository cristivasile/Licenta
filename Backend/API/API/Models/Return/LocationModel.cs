using API.Entities;
using API.Models.Input;

namespace API.Models.Return
{
    public class LocationModel : LocationCreateModel
    {
        public string Id;
        public LocationModel(Location ob)
        {
            Id = ob.Id;
            City = ob.City;
            Address = ob.Address;
        }
    }
}
