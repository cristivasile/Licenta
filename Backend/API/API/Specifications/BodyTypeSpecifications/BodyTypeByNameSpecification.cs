using API.Entities;

namespace API.Specifications.BodyTypeSpecifications
{
    public class BodyTypeByNameSpecification : Specification<BodyType>
    {
        public BodyTypeByNameSpecification(string name) : base(bodyType => bodyType.Name.ToLower() == name.ToLower())
        {
        }
    }
}
