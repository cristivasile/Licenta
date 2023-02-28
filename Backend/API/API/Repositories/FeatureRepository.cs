using API.Context;
using API.Entities;
using API.Interfaces;
using API.Specifications.FeatureSpecifications;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public class FeatureRepository : RepositoryBase<Feature>, IFeatureRepository
    {
        public FeatureRepository(AppDbContext context) : base(context) 
        {
            entitySet = context.Features;
        }

        public async Task<Feature> GetByName(string name) 
            => await ApplySpecification(new FeatureByNameSpecification(name)).FirstOrDefaultAsync();
    }
}
