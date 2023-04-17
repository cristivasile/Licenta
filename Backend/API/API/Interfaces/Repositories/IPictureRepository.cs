using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IPictureRepository: IRepositoryBase<Picture>
    {
        Task<Picture> GetById(string id);
        Task<List<Picture>> GetByVehicleId(string vehicleId);
    }
}
