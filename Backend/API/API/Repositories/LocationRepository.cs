using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.LocationSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class LocationRepository : RepositoryBase<Location>, ILocationRepository
    {
        public LocationRepository(AppDbContext context) : base(context)
        {
            entitySet = context.Locations;
        }

        public async Task<Location> GetByAddress(string address) 
            => await ApplySpecification(new LocationByAddressSpecification(address)).FirstOrDefaultAsync();
    }
}
