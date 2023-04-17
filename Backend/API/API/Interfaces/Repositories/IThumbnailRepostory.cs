using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IThumbnailRepostory : IRepositoryBase<Thumbnail>
    {
        Task<Thumbnail> GetById(string id);
        Task<Thumbnail> GetByVehicleId(string id);
    }
}
