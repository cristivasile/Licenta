using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IFeatureManager
    {
        Task<List<FeatureModel>> GetAll();
        Task<string> Create(FeatureCreateModel toCreate);
        Task Update(string id, FeatureCreateModel toUpdate);
        Task Delete(string id);
    }
}
