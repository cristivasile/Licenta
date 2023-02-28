using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IBodyTypeRepository
    {
        Task<List<BodyType>> GetAll();
        Task<BodyType> GetByName(string name);
        Task Create(BodyType newBodyType);
        Task Update(BodyType updatedBodyType);
        Task Delete(BodyType toDelete);
    }
}
