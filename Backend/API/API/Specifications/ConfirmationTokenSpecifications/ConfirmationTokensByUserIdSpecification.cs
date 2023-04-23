using API.Entities;

namespace API.Specifications.ConfirmationTokenSpecifications
{
    public class ConfirmationTokensByUserIdSpecification : Specification<ConfirmationToken>
    {
        public ConfirmationTokensByUserIdSpecification(string userId) : base(x => x.UserId == userId)
        {
        }
    }
}
