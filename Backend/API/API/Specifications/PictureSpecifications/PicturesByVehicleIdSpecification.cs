using API.Entities;
using System;
using System.Linq.Expressions;

namespace API.Specifications.ImageSpecifications
{
    public class PicturesByVehicleIdSpecification : Specification<Picture>
    {
        public PicturesByVehicleIdSpecification(string vehicleId) : base(x => x.VehicleId == vehicleId) { }
    }
}
