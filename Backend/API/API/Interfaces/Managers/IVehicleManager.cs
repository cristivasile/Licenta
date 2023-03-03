using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IVehicleManager
    {
        Task<int> GetNumberOfVehicles();
        Task<List<VehicleModel>> GetAll(VehiclePaginationModel filters);
        Task<List<VehicleModel>> GetAvailable();
        /// <summary>
        /// Returns all available vehicles i.e. all vehicles that have not yet been sold
        /// </summary>
        Task<List<VehicleModel>> GetAvailable(VehicleFiltersModel filters);
        Task<DetailedVehicleModel> GetById(string id);
        Task<FullVehicleModel> GetByIdExtended(string id);
        Task Create(VehicleCreateModel newVehicle);
        Task Update(string id, VehicleCreateModel updatedVehicle);
        Task UpdateStatus(string id, VehicleStatusUpdateModel updatedStatus);
        Task Delete(string id);
    }
}
