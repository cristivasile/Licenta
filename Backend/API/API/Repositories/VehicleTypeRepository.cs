using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.VehicleTypeSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class VehicleTypeRepository : RepositoryBase<VehicleType>, IVehicleTypeRepository
    {
        public VehicleTypeRepository(AppDbContext context) : base(context)
        {
            entitySet = context.VehicleTypes;
        }

        public async Task<VehicleType> GetById(string brand, string model)
            => await ApplySpecification(new VehicleTypeByIdSpecification(brand, model)).FirstOrDefaultAsync();
    }
}
