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
    public class VehicleRepository : IVehicleRepository
    {
        private readonly AppDbContext context;
        
        public VehicleRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Vehicle>> GetAll()
        {
            var vehicles = await context.Vehicles
                                .Include(x => x.Status)
                                .Include(x => x.Location)
                                .ToListAsync();
            return vehicles;
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
            var vehicles = await context.Vehicles.Where(x => x.Id == id)
                .Include(x => x.Status).Include(x => x.Location).Include(x => x.Features)
                .ToListAsync();
            var vehicle = vehicles[0];
            return vehicle;
        }

        public async Task Create(Vehicle newVehicle, Status newStatus)
        {
            await context.Vehicles.AddAsync(newVehicle);
            await context.Statuses.AddAsync(newStatus);

            await context.SaveChangesAsync();
        }

        public async Task Update(Vehicle updatedVehicle)
        {
            await Task.FromResult(context.Vehicles.Update(updatedVehicle));

            await context.SaveChangesAsync();
        }

        public async Task Delete(Vehicle toDelete)
        {
            await Task.FromResult(context.Vehicles.Remove(toDelete));
            await context.SaveChangesAsync();
        }

        public async Task UpdateStatus(Status updatedStatus)
        {

            context.Statuses.Update(updatedStatus);

            await context.SaveChangesAsync();
        }
    }
}
