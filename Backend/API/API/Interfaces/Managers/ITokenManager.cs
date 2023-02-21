using API.Entities;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ITokenManager
    {
        Task<string> GenerateToken(User user);
    }
}