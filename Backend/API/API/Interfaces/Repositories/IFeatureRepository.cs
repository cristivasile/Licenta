using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IFeatureRepository
    {
        Task<List<Feature>> GetAll();
        Task<Feature> GetById(string id);
        Task Create(Feature newLocation);
        Task Update(Feature updatedLocation);
        Task Delete(Feature toDelete);
    }
}
