using API.Entities;
using System;
using System.Linq.Expressions;

namespace API.Specifications.ImageSpecifications
{
    public class PictureByIdSpecification : Specification<Picture>
    {
        public PictureByIdSpecification(string id) : base(x => x.Id == id) { }
    }
}
