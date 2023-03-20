using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.ThumbnailSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class ThumbnailRepository : RepositoryBase<Thumbnail>, IThumbnailRepostory
    {
        public ThumbnailRepository(AppDbContext context) : base(context)
        {
            entitySet = context.Thumbnails;
        }

        public async Task<Thumbnail> GetById(string id)
            => await ApplySpecification(new ThumbnailByIdSpecification(id)).FirstOrDefaultAsync();

        public async Task<Thumbnail> GetByVehicleId(string id)
            => await ApplySpecification(new ThumbnailByVehicleIdSpecification(id)).FirstOrDefaultAsync();
    }
}
