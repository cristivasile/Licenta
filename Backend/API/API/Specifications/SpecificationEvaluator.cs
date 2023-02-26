using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace API.Specifications
{
    public static class SpecificationEvaluator
    {
        public static IQueryable<EntityType> GetQuery<EntityType>(
            IQueryable<EntityType> inputQueryable, Specification<EntityType> specification)
            where EntityType : Entity
        {
            IQueryable<EntityType> resultQueryable = inputQueryable;

            //apply filters
            if(specification.Filters != null)
                resultQueryable = resultQueryable.Where(specification.Filters);

            //add includes
            resultQueryable = specification.Includes.Aggregate(
                resultQueryable, (current, includeExpression) =>
                    current.Include(includeExpression));

            if (specification.OrderByExpression != null)
                resultQueryable = resultQueryable.OrderBy(specification.OrderByExpression);

            if (specification.SplitQuery)
                resultQueryable = resultQueryable.AsSplitQuery();

            return resultQueryable;
        }
    }
}
