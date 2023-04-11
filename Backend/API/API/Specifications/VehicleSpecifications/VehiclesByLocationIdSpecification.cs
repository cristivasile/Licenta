using API.Entities;

namespace API.Specifications.VehicleSpecifications
{
    public class VehiclesByLocationIdSpecification : Specification<Vehicle>
    {
        public VehiclesByLocationIdSpecification(string id) : base(x => x.LocationId == id) { }
    }
}
