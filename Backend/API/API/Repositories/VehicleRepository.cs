using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Models.Input;
using API.Specifications.VehicleSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class VehicleRepository : RepositoryBase<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(AppDbContext context) : base(context)
        {
            entitySet = context.Vehicles;
        }

        public override async Task<List<Vehicle>> GetAll()
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            var objects = await entitySet.Include(x => x.Status).ToListAsync();
            return objects;
        }

        public async Task<List<Vehicle>> GetAvailable()
            => await ApplySpecification(new AvailableVehiclesSpecification()).ToListAsync();

        public Task<List<Vehicle>> GetAvailable(VehicleFiltersModel filters)
        {
            throw new System.NotImplementedException();
        }

        public async Task<Vehicle> GetById(string id)
            => await ApplySpecification(new VehicleByIdSpecification(id)).FirstOrDefaultAsync();

        public async Task<List<Vehicle>> GetByLocationId(string locationId)
            => await ApplySpecification(new VehiclesByLocationIdSpecification(locationId)).ToListAsync();

        public async Task<int> GetNumberOfAvailableVehicles()
        {
            return await entitySet.Include(x => x.Status).Where(x => x.Status.IsSold == false).CountAsync();
        }

        public async Task<int> GetNumberOfVehicles()
        {
            return await entitySet.CountAsync();
        }
    }
}
