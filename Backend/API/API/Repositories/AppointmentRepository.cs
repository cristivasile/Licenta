using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.AppointmentSpecifications;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class AppointmentRepository : RepositoryBase<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(AppDbContext context) : base(context)
            => entitySet = context.Appointments;

        public async Task<Appointment> GetById(string id)
            => await ApplySpecification(new AppointmentByIdSpecification(id)).FirstOrDefaultAsync();

        /// <param name="upcoming"> - Whether to get only upcoming appointments </param>
        public async Task<List<Appointment>> GetByLocationId(string locationId, bool upcoming = true)
            => await ApplySpecification(new AppointmentsByLocationIdSpecification(locationId, upcoming)).ToListAsync();

        public async Task<List<Appointment>> GetByLocationIdAndDate(string locationId, DateTime date)
            => await ApplySpecification(new AppointmentsByLocationIdAndDateSpecification(locationId, date)).ToListAsync();

        /// <param name="upcoming"> - Whether to get only upcoming appointments </param>
        public async Task<List<Appointment>> GetByUserId(string userId, bool upcoming = true)
            => await ApplySpecification(new AppointmentsByUserIdSpecification(userId, upcoming)).ToListAsync();

        public async Task<List<Appointment>> GetByUserIdAndVehicleId(string userId, string locationId, bool upcoming = true)
            => await ApplySpecification(new AppointmentsByUserIdAndVehicleIdSpecification(userId, locationId, upcoming)).ToListAsync();
    }
}
