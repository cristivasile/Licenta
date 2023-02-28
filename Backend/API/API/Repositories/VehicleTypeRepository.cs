using API.Context;
using API.Entities;
using API.Interfaces.Repositories;

namespace API.Repositories
{
    public class VehicleTypeRepository : RepositoryBase<VehicleType>, IVehicleTypeRepository
    {
        public VehicleTypeRepository(AppDbContext context) : base(context)
        {
            entitySet = context.VehicleTypes;
        }
    }
}
