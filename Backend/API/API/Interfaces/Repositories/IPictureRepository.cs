using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IPictureRepository
    {
        Task<List<Picture>> GetAll();
        Task<Picture> GetById(string id);
        Task<List<Picture>> GetByVehicleId(string vehicleId);
        Task Create(Picture newLocation);
        Task Update(Picture updatedLocation);
        Task Delete(Picture toDelete);
    }
}
