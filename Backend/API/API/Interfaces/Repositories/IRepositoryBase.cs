using API.Entities;
using API.Specifications;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IRepositoryBase<EntityType> where EntityType : Entity
    {
        Task<List<EntityType>> GetAll();
        Task Create(EntityType toCreate);
        Task Update(EntityType toUpdate);
        Task Delete(EntityType toDelete);
    }
}
