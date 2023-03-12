using API.Entities;
using System;
using System.Linq.Expressions;

namespace API.Specifications.LocationSpecifications
{
    public class LocationByCityAndAddressSpecification : Specification<Location>
    {
        public LocationByCityAndAddressSpecification(string city, string address) : base(x => x.City.ToLower() == city.ToLower() 
        && x.Address.Trim().ToLower() == address.Trim().ToLower()) { }
    }
}
