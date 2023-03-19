using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IVehicleManager
    {
        Task<int> GetNumberOfVehicles();
        Task<int> GetNumberOfAvailableVehicles();
        Task<VehiclesPageModel> GetAll(VehicleFiltersModel filters);
        /// <summary>
        /// Returns all available vehicles i.e. all vehicles that have not yet been sold
        /// </summary>
        Task<VehiclesPageModel> GetAvailable(VehicleFiltersModel filters);
        Task<DetailedVehicleModel> GetById(string id);
        Task<FullVehicleModel> GetByIdExtended(string id);
        Task<Dictionary<string, List<string>>> GetBrandModelDictionary();
        Task Create(VehicleCreateModel newVehicle);
        Task Update(string id, VehicleCreateModel updatedVehicle);
        Task UpdateStatus(string id, VehicleStatusUpdateModel updatedStatus);
        Task Delete(string id);
    }
}
