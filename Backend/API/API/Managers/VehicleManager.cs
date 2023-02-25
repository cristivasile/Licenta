using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class VehicleManager : IVehicleManager
    {
        private readonly IVehicleRepository vehicleRepository;

        public VehicleManager(IVehicleRepository manager)
        {
            this.vehicleRepository = manager;
        }

        public async Task<List<VehicleModel>> GetAll()
        {
            //use task.fromresult to simulate tolistasync
            var vehicles = await Task.FromResult((await vehicleRepository.GetAll())
                               .Select(x => new VehicleModel(x)).ToList());

            return vehicles;
        }

        public async Task<List<VehicleModel>> GetAvailable(VehicleSearchModel filter)
        {
            //use task.fromresult to simulate tolistasync
            var vehicles = await Task.FromResult((await vehicleRepository.GetAvailable())
                                .Select(x => new VehicleModel(x))
                                .ToList());

            if (filter != null)
                vehicles = vehicles.Where(x => (x.Brand + x.Model).ToLower()
                        .Contains(filter.filter.Replace(" ", "").ToLower()))
                        .ToList();

            return vehicles;
        }

        public async Task<List<VehicleModel>> GetAvailableFiltered(VehicleFiltersModel filters)
        {
            var vehicles = await GetAvailable(null);

            if (filters.Brand != "")
                vehicles = vehicles.Where(x => x.Brand.ToLower() == filters.Brand.ToLower()).ToList();

            if (filters.MaxMileage != 0)
                vehicles = vehicles.Where(x => x.Odometer <= filters.MaxMileage).ToList();

            if (filters.MaxPrice != 0)
                vehicles = vehicles.Where(x => x.Price <= filters.MaxPrice).ToList();

            if (filters.MinYear != 0)
                vehicles = vehicles.Where(x => x.Year >= filters.MinYear).ToList();

            if(filters.Sort != "")
            {
                if(filters.Sort.ToLower() == "type")
                {
                    if (filters.SortAsc == true)
                        vehicles = vehicles.OrderBy(x => (x.Brand + x.Model)).ToList();
                    else
                        vehicles = vehicles.OrderByDescending(x => (x.Brand + x.Model)).ToList();
                }
                else
                {
                    var multiplier = 1;
                    if (filters.SortAsc == false)
                        multiplier = -1;

                    if(filters.Sort.ToLower()=="price")
                        vehicles = vehicles.OrderBy(x => multiplier * x.Price).ToList();

                    else if(filters.Sort.ToLower() == "mileage")
                        vehicles = vehicles.OrderBy(x => multiplier * x.Odometer).ToList();
                    
                    else
                        vehicles = vehicles.OrderBy(x => multiplier * x.Power).ToList();
                }
            }

            return vehicles;
        }

        public async Task Create(VehicleCreateModel vehicle)
        {
            var generatedId = Utilities.GetGUID();

            Vehicle newVehicle = new()
            {
                Id = generatedId,
                Image = vehicle.Image,
                Brand = vehicle.Brand,
                Model = vehicle.Model,
                LocationAddress = vehicle.LocationAddress,
                Odometer = vehicle.Odometer,
                EngineSize = vehicle.EngineSize,
                Power = vehicle.Power,
                Price = vehicle.Price,
                Year = vehicle.Year
            };


            Status newStatus = new()
            {
                VehicleId = newVehicle.Id,
                VehicleStatus = "available",
                DateAdded = System.DateTime.Now,
                DateSold = null
            };

            var features = new List<VehicleFeature>();

            if (vehicle.Features != null)
            {
                foreach (var featureId in vehicle.Features)
                {
                    features.Add(new VehicleFeature
                    {
                        FeatureId = featureId,
                        VehicleId = generatedId,
                    });
                }
            }

            await vehicleRepository.Create(newVehicle, newStatus, features);
        }

        public async Task<int> Update(string id, VehicleCreateModel updatedVehicle)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            ///404 not found
            if (currentVehicle == null)
                return -1;

            if (updatedVehicle.Image != "")
                currentVehicle.Image = updatedVehicle.Image;

            currentVehicle.Brand = updatedVehicle.Brand;
            currentVehicle.Model = updatedVehicle.Model;
            currentVehicle.Price = updatedVehicle.Price;
            currentVehicle.EngineSize = updatedVehicle.EngineSize;
            currentVehicle.Power = updatedVehicle.Power;
            currentVehicle.Odometer = updatedVehicle.Odometer;
            currentVehicle.LocationAddress = updatedVehicle.LocationAddress;
            currentVehicle.Year = updatedVehicle.Year;

            var features = new List<VehicleFeature>();

            if (updatedVehicle.Features != null)
            {
                foreach (var featureId in updatedVehicle.Features)
                {
                    features.Add(new VehicleFeature
                    {
                        FeatureId = featureId,
                        VehicleId = currentVehicle.Id,
                    });
                }
            }

            await vehicleRepository.Update(currentVehicle, features);
            return 0;
        }

        public async Task<int> UpdateStatus(string id)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            ///404 not found
            if (currentVehicle == null)
                return -1;

            if (currentVehicle.Status.VehicleStatus == "Sold")
                return -2;

            var status = await vehicleRepository.GetStatusById(id);

            status.DateSold = System.DateTime.Now;
            status.VehicleStatus = "Sold";

            await vehicleRepository.UpdateStatus(status);

            return 0;
        }

        public async Task<int> Delete(string id)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            ///404 not found
            if (currentVehicle == null)
                return -1;

            await vehicleRepository.Delete(currentVehicle);
            return 0;
        }

        public async Task<VehicleWithFeaturesModel> GetById(string id)
        {
            var vehicle = await vehicleRepository.GetById(id);

            VehicleWithFeaturesModel returned = null;
            if (vehicle == null)
                return returned;

            var features = await vehicleRepository.GetFeaturesByVehicleId(id);
            var groupedFeatures = features.OrderBy(x => -x.Desirability).ThenBy(x => x.Name).GroupBy(x => x.Desirability).Select(x => x.ToList()).ToList();

            returned = new VehicleWithFeaturesModel(vehicle, features, groupedFeatures);

            return returned;
        }

    }
}
