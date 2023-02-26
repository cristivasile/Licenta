using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace API.Specifications
{
    public abstract class Specification<EntityType> : ISpecification<EntityType> where EntityType : Entity
    {
        public List<Expression<Func<EntityType, object>>> Includes { get; } = new();
        public Expression<Func<EntityType, bool>> Filters { get; } = null;
        public Expression<Func<EntityType, object>> OrderByExpression { get; private set; }
        public bool SplitQuery { get; protected set; } = false;

        public void AddInclude(Expression<Func<EntityType, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }

        public void AddOrderBy(Expression<Func<EntityType, object>> orderByExpression)
        {
            OrderByExpression = orderByExpression;
        }

        public Specification(Expression<Func<EntityType, bool>> rules)
        {
            Filters = rules;
        }
    }
}
