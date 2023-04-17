using API.Context;
using API.Entities;
using API.Interfaces.Repositories;
using API.Specifications;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public abstract class RepositoryBase<EntityType> : IRepositoryBase<EntityType> where EntityType: Entity
    {
        protected readonly AppDbContext context;
        protected DbSet<EntityType> entitySet = null;

        public RepositoryBase(AppDbContext context)
            => this.context = context;

        /// <summary>
        /// Adds a new <Entity> object to the database
        /// </summary>
        public virtual async Task Create(EntityType toCreate)
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            await entitySet.AddAsync(toCreate);
            await SaveAsync();
        }
        /// <summary>
        /// Deletes an <Entity> object from the database
        /// </summary>
        public virtual async Task Delete(EntityType toDelete)
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            await Task.FromResult(entitySet.Remove(toDelete));
            await SaveAsync();
        }
        /// <summary>
        /// Returns a list of all <Entity> type objets in the database
        /// </summary>
        /// <returns></returns>
        public virtual async Task<List<EntityType>> GetAll()
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            var objects = await entitySet.ToListAsync();
            return objects;
        }
        /// <summary>
        /// Updates an <Entity> object
        /// </summary>
        public virtual async Task Update(EntityType updatedObject)
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            await Task.FromResult(entitySet.Update(updatedObject));
            await SaveAsync();
        }

        /// <summary>
        /// Used to apply a specification on the current entity set
        /// </summary>
        protected IQueryable<EntityType> ApplySpecification(Specification<EntityType> specification)
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            return SpecificationEvaluator.GetQuery(entitySet, specification);
        }

        protected async Task SaveAsync() => await context.SaveChangesAsync();
    }
}
