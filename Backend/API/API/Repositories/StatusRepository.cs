using API.Entities;
using API.Interfaces.Repositories;

namespace API.Repositories
{
    public class StatusRepository : RepositoryBase<Status>, IStatusRepository
    {
        public StatusRepository(AppDbContext context) : base(context)
            => entitySet = context.Statuses;
    }
}
