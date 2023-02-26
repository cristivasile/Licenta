using API.Entities;
using System;
using System.Linq.Expressions;

namespace API.Specifications.VehicleSpecifications
{
    public class VehicleByIdSpecification : Specification<Vehicle>
    {
        public VehicleByIdSpecification(string id) : base(x => x.Id == id)
        {
            AddInclude(x => x.Status);
            AddInclude(x => x.Features);
            AddInclude(x => x.Location);

            SplitQuery = true;
        }
    }
}
