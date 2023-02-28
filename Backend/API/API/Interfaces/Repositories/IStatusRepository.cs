using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IStatusRepository
    {
        Task<List<Status>> GetAll();
        Task Create(Status newBodyType);
        Task Update(Status updatedBodyType);
        Task Delete(Status toDelete);
    }
}
