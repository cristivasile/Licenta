using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.VehicleSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class VehicleRepository : RepositoryBase<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(AppDbContext context) : base(context)
        {
            entitySet = context.Vehicles;
        }

        public async Task<List<Vehicle>> GetAvailable()
            => await ApplySpecification(new AvailableVehiclesSpecification()).ToListAsync();
        
        public async Task<Vehicle> GetById(string id)
            => await ApplySpecification(new VehicleByIdSpecification(id)).FirstOrDefaultAsync();

    }
}
