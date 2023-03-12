using API.Entities;

namespace API.Specifications.LocationSpecifications
{
    public class LocationByIdSpecification : Specification<Location>
    {
        public LocationByIdSpecification(string id) : base(x => x.Id == id) { }
    }
}
