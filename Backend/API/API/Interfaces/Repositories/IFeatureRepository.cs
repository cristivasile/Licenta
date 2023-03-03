using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IFeatureRepository
    {
        Task<List<Feature>> GetAll();
        Task<Feature> GetByName(string id);
        Task Create(Feature newLocation);
        Task Update(Feature updatedLocation);
        Task Delete(Feature toDelete);
    }
}
