using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{ 
    public interface IUserDetailsRepository : IRepositoryBase<UserDetails>
    {
        Task<UserDetails> GetByUserId(string userId);
        Task<List<UserDetails>> GetSimilarUsers(UserDetails userDetails);
    }
}
