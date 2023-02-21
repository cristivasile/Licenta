using API.Entities;
using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IVehicleRepository
    {
        Task<List<Vehicle>> GetAll();
        Task<List<Vehicle>> GetAvailable();
        Task<Vehicle> GetById(string id);
        Task<List<Feature>> GetFeaturesByVehicleId(string id);
        Task<Status> GetStatusById(string id);
        Task Create(Vehicle newVehicle, Status newStatus, List<VehicleFeature> features);
        Task Update(Vehicle updatedVehicle, List<VehicleFeature> features);
        Task UpdateStatus(Status updatedStatus);
        Task Delete(Vehicle toDelete);
    }
}
