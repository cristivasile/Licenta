using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IBodyTypeRepository : IRepositoryBase<BodyType>
    {
        Task<BodyType> GetByName(string name);
    }
}
