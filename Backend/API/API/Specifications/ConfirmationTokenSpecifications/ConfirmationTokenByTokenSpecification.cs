using API.Entities;

namespace API.Specifications.ConfirmationTokenSpecifications
{
    public class ConfirmationTokenByTokenSpecification : Specification<ConfirmationToken>
    {
        public ConfirmationTokenByTokenSpecification(string token) : base(x => x.Token == token)
        {
        }
    }
}
