using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ILocationManager
    {
        Task<List<LocationModel>> GetAll();
        Task<LocationModel> GetByAddress(string name);
        Task Create(LocationCreateModel newVehicle);
        Task<int> Update(string name, LocationCreateModel updatedVehicle);
        Task<int> Delete(string name);
    }
}
