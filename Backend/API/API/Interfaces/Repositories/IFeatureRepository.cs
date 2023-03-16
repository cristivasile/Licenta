using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IFeatureRepository
    {
        Task<List<Feature>> GetAll();
        Task<Feature> GetById(string id);
        Task<Feature> GetByName(string name);
        Task Create(Feature newLocation);
        Task Update(Feature updatedLocation);
        Task Delete(Feature toDelete);
    }
}
