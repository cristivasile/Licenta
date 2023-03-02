using API.Models.Input;
using API.Models.Return;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface ILocationManager
    {
        Task<List<LocationModel>> GetAll();
        Task<LocationModel> GetByAddress(string name);
        Task Create(LocationCreateModel newVehicle);
        Task Update(string name, LocationCreateModel updatedVehicle);
        Task Delete(string name);
    }
}
