﻿using API.Models.Input;
using API.Models.Return;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IPictureManager
    {
        Task<List<string>> GetByVehicleId(string vehicleId);
    }
}
