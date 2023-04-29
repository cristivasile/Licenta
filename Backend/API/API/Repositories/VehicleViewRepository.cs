using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.UserDetailsSpecifications;
using API.Specifications.VehicleViewSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class VehicleViewRepository : RepositoryBase<VehicleView>, IVehicleViewRepository
    {
        public VehicleViewRepository(AppDbContext context) : base(context)
            => entitySet = context.VehicleViews;
        public async Task<List<VehicleView>> GetByUserId(string userId)
            => await ApplySpecification(new VehicleViewsByUserIdSpecification(userId)).ToListAsync();

    }
}
