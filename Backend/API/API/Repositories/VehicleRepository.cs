using API.Context;
using API.Entities;
using API.Interfaces;
using API.Models;
using API.Specifications.VehicleSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class VehicleRepository : Repository<Vehicle>, IVehicleRepository
    {
        
        public VehicleRepository(AppDbContext context) : base(context)
        {
            entitySet = context.Vehicles;
        }

        public async Task CreateWithStatus(Vehicle newVehicle, Status newStatus)
        {
            await context.Vehicles.AddAsync(newVehicle);
            await context.Statuses.AddAsync(newStatus);
            await SaveAsync();
        }

        public async Task<List<Vehicle>> GetAvailable()
            => await ApplySpecification(new AvailableVehiclesSpecification()).ToListAsync();
        
        public async Task<Vehicle> GetById(string id)
            => await ApplySpecification(new VehicleByIdSpecification(id)).FirstOrDefaultAsync();

        public async Task UpdateStatus(Status updatedStatus)
        {
            context.Statuses.Update(updatedStatus);
            await SaveAsync();
        }
    }
}
