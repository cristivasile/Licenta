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
    public class LocationRepository : RepositoryBase<Location>, ILocationRepository
    {

        public LocationRepository(AppDbContext context) : base(context) { }

        public async Task<Location> GetByName(string name)
        {
            var locations = await context.Locations.FirstOrDefaultAsync(x => x.Address == name);
            return locations;
        }
    }
}
