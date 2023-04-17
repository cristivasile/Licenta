using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IAppointmentTypeManager
    {
        Task<List<AppointmentTypeModel>> GetByLocationId(string locationId);
        Task Create(AppointmentTypeCreateModel toCreate);
        Task Update(string id, AppointmentTypeCreateModel toUpdate);
        Task Delete(string id);
    }
}
