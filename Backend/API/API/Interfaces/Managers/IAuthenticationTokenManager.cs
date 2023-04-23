using API.Entities;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IAuthenticationTokenManager
    {
        Task<string> GenerateToken(User user);
    }
}