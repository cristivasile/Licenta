using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IAppointmentTypeRepository : IRepositoryBase<AppointmentType> 
    {
        Task<List<AppointmentType>> GetByLocationId(string locationId);
        Task<AppointmentType> GetById(string id);
    }
}
