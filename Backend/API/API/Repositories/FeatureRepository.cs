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
    public class FeatureRepository : IFeatureRepository
    {
        private readonly AppDbContext storage;

        public FeatureRepository(AppDbContext context)
        {
            storage = context;
        }

        public async Task Create(Feature newFeature)
        {
            await storage.Features.AddAsync(newFeature);
            await storage.SaveChangesAsync();
        }

        public async Task Delete(Feature toDelete)
        {
            await Task.FromResult(storage.Features.Remove(toDelete));
            await storage.SaveChangesAsync();
        }

        public async Task<List<Feature>> GetAll()
        {
            var locations = await storage.Features.ToListAsync();
            return locations;
        }

        public async Task<Feature> GetById(string id)
        {
            var locations = await storage.Features.FirstOrDefaultAsync(x => x.Id == id);
            return locations;
        }

        public async Task Update(Feature updatedFeature)
        {
            await Task.FromResult(storage.Features.Update(updatedFeature));
            await storage.SaveChangesAsync();
        }
    }
}
