using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace API.Specifications
{
    public interface ISpecification<Entity>
    {
        public void AddInclude(Expression<Func<Entity, object>> includeExpression);
        public void AddOrderBy(Expression<Func<Entity, object>> orderByExpression);
    }
}
