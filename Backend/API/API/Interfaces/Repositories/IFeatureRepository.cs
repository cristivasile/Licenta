using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IFeatureRepository : IRepositoryBase<Feature>
    {
        Task<Feature> GetById(string id);
        Task<Feature> GetByName(string name);
    }
}
