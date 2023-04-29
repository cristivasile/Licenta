using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.UserDetailsSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class UserDetailsRepository : RepositoryBase<UserDetails>, IUserDetailsRepository
    {
        public UserDetailsRepository(AppDbContext context) : base(context)
            => entitySet = context.UserDetails;

        public async Task<UserDetails> GetByUIserId(string userId)
            => await ApplySpecification(new UserDetailsByUserIdSpecification(userId)).FirstOrDefaultAsync();

        public async Task<List<UserDetails>> GetSimilarUsers(UserDetails userDetails)
            => await ApplySpecification(new SimilarUserDetailsSpecification(userDetails)).ToListAsync();

    }
}
