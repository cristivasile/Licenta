using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IFeatureManager
    {
        Task<List<FeatureModel>> GetAll();
        Task<FeatureModel> GetByName(string id);
        Task Create(FeatureCreateModel newVehicle);
        Task Update(string id, FeatureCreateModel updatedVehicle);
        Task Delete(string id);
    }
}
