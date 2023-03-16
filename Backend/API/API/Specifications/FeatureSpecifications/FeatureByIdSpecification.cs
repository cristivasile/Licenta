using API.Entities;

namespace API.Specifications.FeatureSpecifications
{
    public class FeatureByIdSpecification : Specification<Feature>
    {
        public FeatureByIdSpecification(string id) : base(x => x.Id == id) { }
    }
}
