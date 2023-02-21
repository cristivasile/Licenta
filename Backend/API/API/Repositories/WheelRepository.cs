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
    public class WheelRepository : IWheelRepository
    {
        private readonly AppDbContext storage;

        public WheelRepository(AppDbContext context)
        {
            storage = context;
        }

        public async Task Create(Wheel newWheel)
        {
            await storage.Wheels.AddAsync(newWheel);
            await storage.SaveChangesAsync();
        }

        public async Task Delete(Wheel toDelete)
        {
            await Task.FromResult(storage.Wheels.Remove(toDelete));
            await storage.SaveChangesAsync();
        }

        public async Task<List<Wheel>> GetAll()
        {
            var wheels = await storage.Wheels.ToListAsync();
            return wheels;
        }

        public async Task<Wheel> GetById(string id)
        {
            var wheels = await storage.Wheels.FirstOrDefaultAsync(x => x.Id == id);
            return wheels;
        }

        public async Task Update(Wheel updatedWheel)
        {
            await Task.FromResult(storage.Wheels.Update(updatedWheel));
            await storage.SaveChangesAsync();
        }
    }
}
