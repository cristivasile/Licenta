using API.Entities;

namespace API.Specifications.UserDetailsSpecifications
{
    public class UserDetailsByUserIdSpecification : Specification<UserDetails>
    {
        public UserDetailsByUserIdSpecification(string userId) : base(x => x.UserId == userId) { }
    }
}
