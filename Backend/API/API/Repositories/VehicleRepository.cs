using API.Context;
using API.Entities;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class VehicleRepository : RepositoryBase<Vehicle>, IVehicleRepository
    {
        
        public VehicleRepository(AppDbContext context) : base(context) { }

        public async Task CreateWithStatus(Vehicle newVehicle, Status newStatus)
        {
            await context.Vehicles.AddAsync(newVehicle);
            await context.Statuses.AddAsync(newStatus);

            await context.SaveChangesAsync();
        }

        public async Task<List<Vehicle>> GetAvailable()
        {
            var vehicles = await context.Vehicles
                             .Include(x => x.Status)
                             .Where(x => x.Status.IsSold == false)
                             .Include(x => x.Location)
                             .ToListAsync();

            return vehicles;
        }
        
        public async Task<Vehicle> GetById(string id)
        {
            var vehicle = await context.Vehicles.Where(x => x.Id == id)
                .Include(x => x.Status).Include(x => x.Location).Include(x => x.Features)
                .FirstOrDefaultAsync();
            return vehicle;
        }

        public async Task UpdateStatus(Status updatedStatus)
        {

            context.Statuses.Update(updatedStatus);

            await context.SaveChangesAsync();
        }
    }
}
