using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace API.Specifications
{
    public interface ISpecification<Entity>
    {
        protected void AddInclude(Expression<Func<Entity, object>> includeExpression);
        protected void AddOrderBy(Expression<Func<Entity, object>> orderByExpression);

    }
}
