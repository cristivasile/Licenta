using API.Entities;

namespace API.Specifications.FeatureSpecifications
{
    public class FeatureByNameSpecification : Specification<Feature>
    {
        public FeatureByNameSpecification(string name) : base(x => x.Name.ToLower() == name.ToLower()) { }
    }
}
