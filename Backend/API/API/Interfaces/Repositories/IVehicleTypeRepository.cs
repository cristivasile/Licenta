﻿using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Repositories
{
    public interface IVehicleTypeRepository : IRepositoryBase<VehicleType>
    {
        Task<VehicleType> GetById(string brand, string model);
    }
}
