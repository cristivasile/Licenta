using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications.FeatureSpecifications;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class FeatureRepository : RepositoryBase<Feature>, IFeatureRepository
    {
        public FeatureRepository(AppDbContext context) : base(context) 
        {
            entitySet = context.Features;
        }

        public async Task<Feature> GetById(string id) 
            => await ApplySpecification(new FeatureByIdSpecification(id)).FirstOrDefaultAsync();

        public async Task<Feature> GetByName(string name)
            => await ApplySpecification(new FeatureByNameSpecification(name)).FirstOrDefaultAsync();
    }
}
