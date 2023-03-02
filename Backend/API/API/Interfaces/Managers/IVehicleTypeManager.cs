using API.Entities;
using API.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IVehicleTypeManager
    {
        Task<List<VehicleTypeModel>> GetAll();
        Task<Dictionary<string, List<string>>> GetBrandModelDictionary();
        Task Delete(VehicleTypeModel toDelete);
    }
}
