using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.LocationSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class LocationRepository : RepositoryBase<Location>, ILocationRepository
    {
        public LocationRepository(AppDbContext context) : base(context)
            => entitySet = context.Locations;

        public override async Task<List<Location>> GetAll()
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            var objects = await entitySet.Include(x => x.Schedules).ToListAsync();
            return objects;
        }

        public async Task<Location> GetByCityAndAddress(string city, string address)
            => await ApplySpecification(new LocationByCityAndAddressSpecification(city, address)).FirstOrDefaultAsync();

        public async Task<Location> GetById(string id) 
            => await ApplySpecification(new LocationByIdSpecification(id)).FirstOrDefaultAsync();
    }
}
