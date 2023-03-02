using API.Entities;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface ITokenManager
    {
        Task<string> GenerateToken(User user);
    }
}