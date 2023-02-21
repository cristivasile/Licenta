using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IWheelRepository
    {
        Task<List<Wheel>> GetAll();
        Task<Wheel> GetById(string id);
        Task Create(Wheel newLocation);
        Task Update(Wheel updatedLocation);
        Task Delete(Wheel toDelete);
    }
}
