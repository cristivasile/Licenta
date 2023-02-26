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
    public class FeatureRepository : RepositoryBase<Feature>, IFeatureRepository
    {

        public FeatureRepository(AppDbContext context) : base(context) { }

        public async Task<Feature> GetByName(string name)
        {
            var locations = await context.Features.FirstOrDefaultAsync(x => x.Name == name);
            return locations;
        }
    }
}
