using API.Models.Input;
using API.Models.Return;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IVehicleManager
    {
        Task<List<VehicleModel>> GetAll();
        Task<List<VehicleModel>> GetAvailable(VehicleSearchModel filter = null);
        Task<List<VehicleModel>> GetAvailableFiltered(VehicleFiltersModel filters);
        Task<VehicleWithFeaturesModel> GetById(string id);
        Task Create(VehicleCreateModel newVehicle);
        Task Update(string id, VehicleCreateModel updatedVehicle);
        Task UpdateStatus(string id, VehicleUpdateStatusModel updatedStatus);
        Task Delete(string id);
    }
}
