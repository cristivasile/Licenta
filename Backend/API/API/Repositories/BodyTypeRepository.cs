using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.BodyTypeSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class BodyTypeRepository : RepositoryBase<BodyType>, IBodyTypeRepository
    {
        public BodyTypeRepository(AppDbContext context) : base(context)
            => entitySet = context.BodyTypes;

        public async Task<BodyType> GetByName(string name)
            => await ApplySpecification(new BodyTypeByNameSpecification(name)).FirstOrDefaultAsync();
    }
}
