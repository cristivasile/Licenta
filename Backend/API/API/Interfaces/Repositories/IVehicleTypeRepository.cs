using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IVehicleTypeRepository
    {
        Task<List<VehicleType>> GetAll();
        Task Create(VehicleType newBrand);
        Task Update(VehicleType updatedBrand);
        Task Delete(VehicleType toDelete);
        Task<VehicleType> GetById(string brand, string model);
    }
}
