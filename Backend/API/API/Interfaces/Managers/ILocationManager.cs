using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface ILocationManager
    {
        Task<List<LocationModel>> GetAll();
        Task Create(LocationCreateModel newVehicle);
        Task Update(string id, LocationCreateModel updatedVehicle);
        Task Delete(string id);
    }
}
