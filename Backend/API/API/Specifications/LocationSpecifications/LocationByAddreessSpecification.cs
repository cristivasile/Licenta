using API.Entities;

namespace API.Specifications.LocationSpecifications
{
    public class LocationByAddressSpecification : Specification<Location>
    {
        public LocationByAddressSpecification(string name) : base(x => x.Address.ToLower() == name.ToLower()) { }
    }
}
