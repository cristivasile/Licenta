using API.Context;
using API.Entities;
using API.Interfaces.Repositories;

namespace API.Repositories
{
    public class BodyTypeRepository : RepositoryBase<BodyType>, IBodyTypeRepository
    {
        public BodyTypeRepository(AppDbContext context) : base(context)
        {
            entitySet = context.BodyTypes;
        }
    }
}
