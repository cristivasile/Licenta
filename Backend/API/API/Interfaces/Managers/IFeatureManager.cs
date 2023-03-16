using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IFeatureManager
    {
        Task<List<FeatureModel>> GetAll();
        Task Create(FeatureCreateModel newVehicle);
        Task Update(string id, FeatureCreateModel updatedVehicle);
        Task Delete(string id);
    }
}
