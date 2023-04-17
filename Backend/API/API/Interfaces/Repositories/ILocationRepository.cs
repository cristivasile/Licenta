using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface ILocationRepository : IRepositoryBase<Location>
    {
        Task<Location> GetById(string id);
        Task<Location> GetByCityAndAddress(string city, string address);
    }
}
