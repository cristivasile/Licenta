using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IScheduleRepository : IRepositoryBase<Schedule>
    {
        Task<List<Schedule>> GetByLocationId(string locationId);
    }
}
