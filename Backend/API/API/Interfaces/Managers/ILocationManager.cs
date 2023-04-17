using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface ILocationManager
    {
        //returns the id after creating
        Task<string> Create(LocationCreateModel toCreate);
        Task<List<LocationModel>> GetAll();
        Task Update(string id, LocationCreateModel toUpdate); 
        Task Delete(string id);
    }
}
