using System;
using System.Linq.Expressions;

namespace API.Interfaces
{
    public interface ISpecification<Entity>
    {
        public void AddInclude(Expression<Func<Entity, object>> includeExpression);
        public void AddOrderBy(Expression<Func<Entity, object>> orderByExpression);
    }
}
