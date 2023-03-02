using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IVehicleTypeManager
    {
        Task<List<VehicleTypeModel>> GetAll();
        Task<Dictionary<string, List<string>>> GetBrandModelDictionary();
        Task Delete(VehicleTypeDeleteModel toDelete);
    }
}
