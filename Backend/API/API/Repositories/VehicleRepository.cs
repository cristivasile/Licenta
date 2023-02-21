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
                             .Where(x => x.Status.VehicleStatus.ToLower() == "available")
                             .Include(x => x.Location)
                             .ToListAsync();

            return vehicles;
        }
        
        public async Task<Vehicle> GetById(string id)
        {
            var vehicles = await context.Vehicles.Include(x => x.Status).Include(x => x.Location).Where(x => x.Id == id).ToListAsync();
            var vehicle = vehicles[0];
            return vehicle;
        }

        public async Task Create(Vehicle newVehicle, Status newStatus, List<VehicleFeature> features)
        {
            await context.Vehicles.AddAsync(newVehicle);
            await context.Statuses.AddAsync(newStatus);

            //assign features
            await context.VehicleFeature.AddRangeAsync(features);

            await context.SaveChangesAsync();
        }

        public async Task Update(Vehicle updatedVehicle, List<VehicleFeature> features)
        {
            await Task.FromResult(context.Vehicles.Update(updatedVehicle));
            //delete old features
            context.VehicleFeature.RemoveRange(context.VehicleFeature.Where(x => x.VehicleId == updatedVehicle.Id));
            //assign new features
            await context.VehicleFeature.AddRangeAsync(features);

            await context.SaveChangesAsync();
        }

        public async Task Delete(Vehicle toDelete)
        {
            var features = await context.VehicleFeature.Where(x => x.VehicleId == toDelete.Id)
                                                       .ToListAsync();
            foreach(var feature in features)
                await Task.FromResult(context.VehicleFeature.Remove(feature));

            await Task.FromResult(context.Vehicles.Remove(toDelete));
            await context.SaveChangesAsync();
        }

        public async Task<List<Feature>> GetFeaturesByVehicleId(string id)
        {
            var features = await context.VehicleFeature
                                        .Where(x => x.VehicleId == id)
                                        .Include(x => x.Feature)
                                        .Select(x => x.Feature)
                                        .OrderBy(x => -x.Desirability)
                                        .ToListAsync();

            return features;
        }

        public async Task UpdateStatus(Status updatedStatus)
        {

            context.Statuses.Update(updatedStatus);

            await context.SaveChangesAsync();
        }

        public async Task<Status> GetStatusById(string id)
        {
            var status = await context.Statuses.FirstOrDefaultAsync(x => x.VehicleId == id);
            return status;
        }
    }
}
