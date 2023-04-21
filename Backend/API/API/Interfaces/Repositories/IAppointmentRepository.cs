using API.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IAppointmentRepository : IRepositoryBase<Appointment>
    {
        Task<Appointment> GetById(string id);
        Task<List<Appointment>> GetByUserId(string userId, bool upcoming = true);
        Task<Appointment> GetByUserIdAndVehicleId(string userId, string vehicleId, bool upcoming = true);
        Task<List<Appointment>> GetByLocationId(string locationId, bool upcoming = true);
        Task<List<Appointment>> GetByLocationIdAndDate(string locationId, DateTime date);
    }
}
