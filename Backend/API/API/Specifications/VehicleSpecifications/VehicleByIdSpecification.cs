using API.Entities;

namespace API.Specifications.VehicleSpecifications
{
    public class VehicleByIdSpecification : Specification<Vehicle>
    {
        public VehicleByIdSpecification(string id) : base(x => x.Id == id)
        {
            SplitQuery = true;

            AddInclude(x => x.Status);
            AddInclude(x => x.Status.PurchasedBy);
            AddInclude(x => x.Features);
            AddInclude(x => x.Location);
            AddInclude(x => x.Thumbnail);
        }
    }
}
