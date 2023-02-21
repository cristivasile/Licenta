using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IWheelManager
    {
        Task<List<WheelModel>> GetAll();
        Task<WheelModel> GetById(string id);
        Task Create(WheelCreateModel newVehicle);
        Task<int> Update(string id, WheelCreateModel updatedVehicle);
        Task<int> Delete(string id);
    }
}
