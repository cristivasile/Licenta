using API.Models.Input;
using API.Models.Return;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IAppointmentManager
    {
        Task Create(AppointmentCreateModel newAppointment, string username);
        Task Delete(string appointmentId);
        Task<List<AppointmentModel>> GetAllByLocationId(string locationId, bool upcoming = true);
        Task<List<AppointmentModel>> GetAllByUsername(string username, bool upcoming = true);
        Task<AppointmentModel> GetByUserAndVehicleId(AppointmentUserRequestModel request, bool upcoming = true);
        Task<Dictionary<string, List<DateTime>>> GetAvailableAppointmentTimes(AppointmentIntervalsRequestModel request);
    }
}
