using API.Entities;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IRecommendationManager
    {
        Task<List<VehicleModel>> SortByRecommended(List<VehicleModel> vehicles, UserDetails details);
    }
}
