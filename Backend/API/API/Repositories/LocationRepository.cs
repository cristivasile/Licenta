using API.Context;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly AppDbContext storage;

        public LocationRepository(AppDbContext context)
        {
            storage = context;
        }

        public async Task Create(Location newLocation)
        {
            await storage.Locations.AddAsync(newLocation);
            await storage.SaveChangesAsync();
        }

        public async Task Delete(Location toDelete)
        {
            await Task.FromResult(storage.Locations.Remove(toDelete));
            await storage.SaveChangesAsync();
        }

        public async Task<List<Location>> GetAll()
        {
            var locations = await storage.Locations.ToListAsync();
            return locations;
        }

        public async Task<Location> GetByName(string name)
        {
            var locations = await storage.Locations.FirstOrDefaultAsync(x => x.Address == name);
            return locations;
        }

        public async Task Update(Location updatedLocation)
        {
            await Task.FromResult(storage.Locations.Update(updatedLocation));
            await storage.SaveChangesAsync();
        }
    }
}
