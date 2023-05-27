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
            => await ApplySpecification(
                ApplySpecification(new AppointmentsByLocationIdSpecification(locationId)),
                new AppointmentsByUpcomingSpecification(upcoming)).ToListAsync();

        public async Task<List<Appointment>> GetByLocationIdAndDate(string locationId, DateTime date)
            => await ApplySpecification(
                ApplySpecification(new AppointmentsByLocationIdSpecification(locationId)),
                new AppointmentsByDateSpecification(date)).ToListAsync();

        /// <param name="upcoming"> - Whether to get only upcoming appointments </param>
        public async Task<List<Appointment>> GetByUserId(string userId, bool upcoming = true)
            => await ApplySpecification(
                ApplySpecification(new AppointmentsByUserIdSpecification(userId)),
                new AppointmentsByUpcomingSpecification(upcoming)).ToListAsync();

        public async Task<Appointment> GetByUserIdAndVehicleId(string userId, string locationId, bool upcoming = true)
            => await ApplySpecification(
                ApplySpecification(new AppointmentsByUserIdSpecification(userId)),
                new AppointmentByVehicleIdSpecification(locationId, upcoming)).FirstOrDefaultAsync();
    }
}
