using API.Entities;

namespace API.Specifications.VehicleSpecifications
{
    public class VehicleByIdSpecification : Specification<Vehicle>
    {
        public VehicleByIdSpecification(string id) : base(x => x.Id == id)
        {
            AddInclude(x => x.Status);
            AddInclude(x => x.Features);
            AddInclude(x => x.Location);
            AddInclude(x => x.Images);
            AddInclude(x => x.Thumbnail);

            SplitQuery = true;
        }
    }
}
