using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface ILocationRepository
    {
        Task<List<Location>> GetAll();
        Task<Location> GetById(string id);
        Task<Location> GetByCityAndAddress(string city, string address);
        Task Create(Location newLocation);
        Task Update(Location updatedLocation);
        Task Delete(Location toDelete);
    }
}
