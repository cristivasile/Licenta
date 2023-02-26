using API.Context;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Repositories
{
    public abstract class RepositoryBase<Entity> where Entity: class
    {
        protected readonly AppDbContext context;
        protected DbSet<Entity> entitySet = null;
        public RepositoryBase(AppDbContext context)
        {
            this.context = context;
        }
        /// <summary>
        /// Adds a new <Entity> object to the database
        /// </summary>
        public virtual async Task Create(Entity toCreate)
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            await entitySet.AddAsync(toCreate);
            await context.SaveChangesAsync();
        }
        /// <summary>
        /// Deletes an <Entity> object from the database
        /// </summary>
        public virtual async Task Delete(Entity toDelete)
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            await Task.FromResult(entitySet.Remove(toDelete));
            await context.SaveChangesAsync();
        }
        /// <summary>
        /// Returns a list of all <Entity> type objets in the database
        /// </summary>
        /// <returns></returns>
        public virtual async Task<List<Entity>> GetAll()
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            var objects = await entitySet.ToListAsync();
            return objects;
        }
        /// <summary>
        /// Updates an <Entity> object
        /// </summary>
        public virtual async Task Update(Entity updatedObject)
        {
            if (entitySet == null)
                throw new System.Exception("The entity set was not initialised!");

            await Task.FromResult(entitySet.Update(updatedObject));
            await context.SaveChangesAsync();
        }
    }
}
