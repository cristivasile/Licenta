using API.Entities;
using System;
using System.Linq.Expressions;

namespace API.Specifications.LocationSpecifications
{
    public class LocationByAddressSpecification : Specification<Location>
    {
        public LocationByAddressSpecification(string name) : base(x => x.Address.ToLower() == name.ToLower()) { }
    }
}
