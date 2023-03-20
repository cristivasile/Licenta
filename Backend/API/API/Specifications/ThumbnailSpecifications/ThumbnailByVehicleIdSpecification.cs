using API.Entities;

namespace API.Specifications.ThumbnailSpecifications
{
    public class ThumbnailByVehicleIdSpecification : Specification<Thumbnail>
    {
        public ThumbnailByVehicleIdSpecification(string vehicleId) : base(x => x.VehicleId == vehicleId) { }
    }
}
