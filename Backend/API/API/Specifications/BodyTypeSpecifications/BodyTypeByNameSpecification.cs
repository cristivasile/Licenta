using API.Entities;
using System;
using System.Linq.Expressions;

namespace API.Specifications.BodyTypeSpecifications
{
    public class BodyTypeByNameSpecification : Specification<BodyType>
    {
        public BodyTypeByNameSpecification(string name) : base(bodyType => bodyType.Name.ToLower() == name.ToLower())
        {
        }
    }
}
