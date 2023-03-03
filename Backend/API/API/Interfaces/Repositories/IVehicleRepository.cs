using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IVehicleRepository
    {
        Task<List<Vehicle>> GetAll();
        Task<List<Vehicle>> GetAvailable();
        Task<Vehicle> GetById(string id);
        Task Create(Vehicle newVehicle);
        Task Update(Vehicle updatedVehicle);
        Task Delete(Vehicle toDelete);
    }
}
