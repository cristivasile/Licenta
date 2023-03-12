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

        public async Task<Location> GetByCityAndAddress(string city, string address)
            => await ApplySpecification(new LocationByCityAndAddressSpecification(city, address)).FirstOrDefaultAsync();

        public async Task<Location> GetById(string id) 
            => await ApplySpecification(new LocationByIdSpecification(id)).FirstOrDefaultAsync();
    }
}
