using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IConfirmationTokenManager
    {
        Task<ConfirmationToken> Create(string userId, ConfirmationTokenTypeEnum type);
        Task Delete(string token);
        Task<ConfirmationToken> GetByToken(string token);
        Task<List<ConfirmationToken>> GetByUserId(string userId);
    }
}
