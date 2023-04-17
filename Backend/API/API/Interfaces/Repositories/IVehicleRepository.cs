using API.Entities;
using API.Models.Input;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IVehicleRepository : IRepositoryBase<Vehicle>
    {
        Task<int> GetNumberOfVehicles();
        Task<int> GetNumberOfAvailableVehicles();
        Task<List<Vehicle>> GetAvailable();
        Task<List<Vehicle>> GetAvailable(VehicleFiltersModel filters);
        Task<List<Vehicle>> GetByLocationId(string locationId);
        Task<Vehicle> GetById(string id);
    }
}
