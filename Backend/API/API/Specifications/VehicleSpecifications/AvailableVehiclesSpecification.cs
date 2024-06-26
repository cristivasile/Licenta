﻿using API.Entities;

namespace API.Specifications.VehicleSpecifications
{
    public class AvailableVehiclesSpecification : Specification<Vehicle>
    {
        public AvailableVehiclesSpecification() : base(x => x.Status.IsSold == false)
        {
            SplitQuery = true;

            AddInclude(x => x.Status);
            AddInclude(x => x.Location);
        }
    }
}
