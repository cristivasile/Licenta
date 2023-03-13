using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface ILocationManager
    {
        //returns the id after creating
        Task<string> Create(LocationCreateModel newVehicle);
        Task<List<LocationModel>> GetAll();
        Task Update(string id, LocationCreateModel updatedVehicle); 
        Task Delete(string id);
    }
}
