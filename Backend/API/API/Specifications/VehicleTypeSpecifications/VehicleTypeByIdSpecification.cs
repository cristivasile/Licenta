﻿using API.Entities;
using System;
using System.Linq.Expressions;

namespace API.Specifications.VehicleTypeSpecifications
{
    public class VehicleTypeByIdSpecification : Specification<VehicleType>
    {
        public VehicleTypeByIdSpecification(string brand, string model) 
            : base(type => type.Brand.ToLower() == brand.ToLower() && type.Model.ToLower() == model.ToLower())
        {
        }
    }
}
