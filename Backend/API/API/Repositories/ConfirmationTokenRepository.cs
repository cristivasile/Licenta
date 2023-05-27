using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.ConfirmationTokenSpecifications;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class ConfirmationTokenRepository : RepositoryBase<ConfirmationToken>, IConfirmationTokenRepository
    {
        public ConfirmationTokenRepository(AppDbContext context) : base(context)
            => entitySet = context.ConfirmationTokens;

        public async Task<ConfirmationToken> GetByToken(string token)
            => await ApplySpecification(new ConfirmationTokenByTokenSpecification(token)).FirstOrDefaultAsync();

        public async Task<List<ConfirmationToken>> GetByUserId(string userId)
            => await ApplySpecification(new ConfirmationTokensByUserIdSpecification(userId)).ToListAsync();
    }
}
