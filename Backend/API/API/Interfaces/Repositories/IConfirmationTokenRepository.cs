using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IConfirmationTokenRepository : IRepositoryBase<ConfirmationToken>
    {
        Task<ConfirmationToken> GetByToken(string token);
        Task<List<ConfirmationToken>> GetByUserId(string userId);
    }
}
