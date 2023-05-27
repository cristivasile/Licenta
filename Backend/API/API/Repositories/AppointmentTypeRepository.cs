using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.AppointmentTypeSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class AppointmentTypeRepository : RepositoryBase<AppointmentType>, IAppointmentTypeRepository
    {
        public AppointmentTypeRepository(AppDbContext context) : base(context)
            => entitySet = context.AppointmentTypes;

        public async Task<AppointmentType> GetById(string id)
            => await ApplySpecification(new AppointmentTypeByIdSpecification(id)).FirstOrDefaultAsync();

        public async Task<List<AppointmentType>> GetByLocationId(string locationId)
            => await ApplySpecification(new AppointmentTypesByLocationIdSpecification(locationId)).ToListAsync();
    }
}
