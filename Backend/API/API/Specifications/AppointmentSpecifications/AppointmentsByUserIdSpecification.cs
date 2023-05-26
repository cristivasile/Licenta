﻿using API.Entities;
using System;

namespace API.Specifications.AppointmentSpecifications
{
    public class AppointmentsByUserIdSpecification : Specification<Appointment>
    {
        public AppointmentsByUserIdSpecification(string userId) 
            : base(x => x.UserId == userId)
        {
            SplitQuery = true;

            AddInclude(x => x.User);
            AddInclude(x => x.AppointmentType);
            AddInclude(x => x.Vehicle);
            AddInclude(x => x.Vehicle.Location);
        }
    }
}
