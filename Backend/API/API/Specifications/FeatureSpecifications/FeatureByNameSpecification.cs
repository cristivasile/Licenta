using API.Entities;
using API.Interfaces;
using System;
using System.Linq.Expressions;

namespace API.Specifications.FeatureSpecifications
{
    public class FeatureByNameSpecification : Specification<Feature>
    {
        public FeatureByNameSpecification(string name) : base(x => x.Name.ToLower() == name.ToLower()) { }
    }
}
