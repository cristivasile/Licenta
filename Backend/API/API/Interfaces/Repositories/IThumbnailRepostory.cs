using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IThumbnailRepostory
    {
        Task<List<Thumbnail>> GetAll();
        Task<Thumbnail> GetById(string id);
        Task<Thumbnail> GetByVehicleId(string id);
        Task Create(Thumbnail newLocation);
        Task Update(Thumbnail updatedLocation);
        Task Delete(Thumbnail toDelete);
    }
}
