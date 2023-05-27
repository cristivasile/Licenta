using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.ScheduleSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class ScheduleRepository : RepositoryBase<Schedule>, IScheduleRepository
    {
        public ScheduleRepository(AppDbContext context) : base(context)
            => entitySet = context.Schedules;

        public async Task<List<Schedule>> GetByLocationId(string locationId)
            => await ApplySpecification(new ScheduleByLocationIdSpecification(locationId)).ToListAsync();

        public async Task<Schedule> GetByLocationIdAndWeekday(string locationId, WeekdayEnum weekday)
            => await ApplySpecification(
                        ApplySpecification(new ScheduleByLocationIdSpecification(locationId)),
                        new ScheduleByWeekdaySpecification(weekday)).FirstOrDefaultAsync();
    }
}
