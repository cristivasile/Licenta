using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Models;
using API.Models.Input;
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
        private readonly IFeatureRepository featureRepository;

        public VehicleManager(IVehicleRepository vehicleRepository, IFeatureRepository featureRepository)
        {
            this.vehicleRepository = vehicleRepository;
            this.featureRepository = featureRepository;
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
                //Brand = vehicle.Brand,
                //Model = vehicle.Model,
                //TODO - fix vehicles
                Description = vehicle.Description,
                LocationAddress = vehicle.LocationAddress,
                Odometer = vehicle.Odometer,
                EngineSize = vehicle.EngineSize,
                Power = vehicle.Power,
                Price = vehicle.Price,
                Year = vehicle.Year,
                Features = new List<Feature>()
            };


            Status newStatus = new()
            {
                VehicleId = newVehicle.Id,
                IsSold = false,
                DateAdded = System.DateTime.Now,
                DateSold = null
            };

            if (vehicle.Features != null)
            {
                foreach (var featureName in vehicle.Features)
                {
                    newVehicle.Features.Add(await featureRepository.GetByName(featureName));
                }
            }

            await vehicleRepository.CreateWithStatus(newVehicle, newStatus);
        }

        public async Task Update(string id, VehicleCreateModel updatedVehicle)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            if (currentVehicle == null)
                throw new Exception("Vehicle doesn't exist!");

            if (updatedVehicle.Image != "")
                currentVehicle.Image = updatedVehicle.Image;

            //TODO - fix vehicles
            //currentVehicle.Brand = updatedVehicle.Brand;
            //currentVehicle.Model = updatedVehicle.Model;
            currentVehicle.Description = updatedVehicle.Description;
            currentVehicle.Price = updatedVehicle.Price;
            currentVehicle.EngineSize = updatedVehicle.EngineSize;
            currentVehicle.Power = updatedVehicle.Power;
            currentVehicle.Odometer = updatedVehicle.Odometer;
            currentVehicle.LocationAddress = updatedVehicle.LocationAddress;
            currentVehicle.Year = updatedVehicle.Year;
            currentVehicle.Features = new List<Feature>();

            if (updatedVehicle.Features != null)
            {
                foreach (var featureName in updatedVehicle.Features)
                {
                    currentVehicle.Features.Add(await featureRepository.GetByName(featureName));
                }
            }

            var features = new List<Feature>();

            if (updatedVehicle.Features != null)
            {
                foreach (var featureName in updatedVehicle.Features)
                {
                    features.Add(await featureRepository.GetByName(featureName));
                }
            }

            await vehicleRepository.Update(currentVehicle);
        }

        public async Task UpdateStatus(string id, VehicleUpdateStatusModel updatedStatus)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            ///404 not found
            if (currentVehicle == null)
                throw new Exception("The vehicle was not found!");

            var status = currentVehicle.Status;
            if (updatedStatus.sold)
            {
                status.DateSold = DateTime.Now;
                status.IsSold = true;
            }
            else
            {
                status.DateSold = null;
                status.IsSold = false;
            }

            await vehicleRepository.UpdateStatus(status);
        }

        public async Task Delete(string id)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            if (currentVehicle == null)
                throw new Exception("Vehicle doesn't exist!");

            await vehicleRepository.Delete(currentVehicle);
        }

        public async Task<VehicleWithFeaturesModel> GetById(string id)
        {
            var vehicle = await vehicleRepository.GetById(id);

            if (vehicle == null)
                return null;

            var groupedFeatures = vehicle.Features.OrderBy(x => -x.Desirability)
                .ThenBy(x => x.Name).GroupBy(x => x.Desirability)
                .ToDictionary(x => x.Key, x => FeatureModel.ConvertToResultType(x.ToList()));

            var returned = new VehicleWithFeaturesModel(vehicle, groupedFeatures);

            return returned;
        }

    }
}
