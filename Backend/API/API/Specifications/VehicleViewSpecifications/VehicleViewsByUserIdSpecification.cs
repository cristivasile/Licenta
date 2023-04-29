using API.Entities;

namespace API.Specifications.VehicleViewSpecifications
{
    public class VehicleViewsByUserIdSpecification : Specification<VehicleView>
    {
        public VehicleViewsByUserIdSpecification(string userId) : base(x => x.UserId == userId) 
        {
            AddInclude(x => x.Vehicle);
        }
    }
}
