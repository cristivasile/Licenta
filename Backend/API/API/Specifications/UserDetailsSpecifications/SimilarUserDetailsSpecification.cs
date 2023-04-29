using API.Entities;

namespace API.Specifications.UserDetailsSpecifications
{
    public class SimilarUserDetailsSpecification : Specification<UserDetails>
    {
        public SimilarUserDetailsSpecification(UserDetails details) 
            : base(x => x.AgeGroup == details.AgeGroup && x.Region == details.Region && x.Sex == details.Sex) { }
    }
}
