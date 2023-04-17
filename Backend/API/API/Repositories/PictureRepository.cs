using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.ImageSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class PictureRepository : RepositoryBase<Picture>, IPictureRepository
    {
        public PictureRepository(AppDbContext context) : base(context)
            => entitySet = context.Images;

        public async Task<Picture> GetById(string id)
           => await ApplySpecification(new PictureByIdSpecification(id)).FirstOrDefaultAsync();

        public async Task<List<Picture>> GetByVehicleId(string vehicleId)
            => await ApplySpecification(new PicturesByVehicleIdSpecification(vehicleId)).ToListAsync();
    }
}
