using API.Entities;
using System;
using System.Linq.Expressions;
using System.Security.Cryptography.X509Certificates;

namespace API.Specifications.ThumbnailSpecifications
{
    public class ThumbnailByIdSpecification : Specification<Thumbnail>
    {
        public ThumbnailByIdSpecification(string id) : base(x => x.Id == id) { }
    }
}
