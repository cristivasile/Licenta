using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IVehicleViewRepository: IRepositoryBase<VehicleView>
    {
        Task<List<VehicleView>> GetByUserId(string userId);
    }
}
