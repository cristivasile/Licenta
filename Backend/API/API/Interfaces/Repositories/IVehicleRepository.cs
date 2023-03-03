using API.Entities;
using API.Models.Input;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IVehicleRepository
    {
        Task<List<Vehicle>> GetAll();
        Task<List<Vehicle>> GetRange(int startWith, int take);
        Task<List<Vehicle>> GetAvailable();
        Task<List<Vehicle>> GetAvailable(VehicleFiltersModel filters);
        Task<int> GetNumberOfVehicles();
        Task<Vehicle> GetById(string id);
        Task Create(Vehicle newVehicle);
        Task Update(Vehicle updatedVehicle);
        Task Delete(Vehicle toDelete);
    }
}
