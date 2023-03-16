using API.Entities;
using API.Helpers;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using API.Models.Input;
using API.Models.Return;
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
        private readonly IBodyTypeRepository bodyTypeRepository;
        private readonly IVehicleTypeRepository vehicleTypeRepository;
        private readonly IStatusRepository statusRepository;
        private readonly ILocationRepository locationRepository;

        public VehicleManager(IVehicleRepository vehicleRepository, IFeatureRepository featureRepository, ILocationRepository locationRepository,
            IBodyTypeRepository bodyTypeRepository, IVehicleTypeRepository vehicleTypeRepository, IStatusRepository statusRepository)
        {
            this.vehicleRepository = vehicleRepository;
            this.featureRepository = featureRepository;
            this.bodyTypeRepository = bodyTypeRepository;
            this.vehicleTypeRepository = vehicleTypeRepository;
            this.statusRepository = statusRepository;
            this.locationRepository = locationRepository;
        }

        public Task<int> GetNumberOfVehicles()
        {
            return vehicleRepository.GetNumberOfVehicles();
        }

        public Task<int> GetNumberOfAvailableVehicles()
        {
            return vehicleRepository.GetNumberOfAvailableVehicles();
        }

        public async Task<DetailedVehicleModel> GetById(string id)
        {
            var vehicle = await vehicleRepository.GetById(id);

            if (vehicle == null)
                return null;

            var returned = new DetailedVehicleModel(vehicle);

            return returned;
        }

        public async Task<FullVehicleModel> GetByIdExtended(string id)
        {
            var vehicle = await vehicleRepository.GetById(id);

            if (vehicle == null)
                return null;

            var returned = new FullVehicleModel(vehicle);

            return returned;
        }

        public async Task<List<VehicleModel>> GetAll(VehiclePaginationModel filters)
        {
            List<Vehicle> vehicles;
            if (filters.StartAt != null && filters.NumberToGet != null)
                vehicles = await vehicleRepository.GetRange(filters.StartAt.Value, filters.NumberToGet.Value);
            else
                vehicles = await vehicleRepository.GetAll();

            return vehicles.Select(x => new VehicleModel(x))
                               .ToList();
        }

        public async Task<List<VehicleModel>> GetAvailable()
        {
            var vehicles = (await vehicleRepository.GetAvailable())
                                .Select(x => new VehicleModel(x))
                                .ToList();

            return vehicles;
        }

        public async Task<List<VehicleModel>> GetAvailable(VehicleFiltersModel filters)
        {
            var vehicles = await GetAvailable();

            //apply filters
            IQueryable<VehicleModel> vehicleQueryable = vehicles.AsQueryable();
            
            if (filters.Brand != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Brand.ToLower() == filters.Brand.ToLower());
            if (filters.MaxMileage != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Odometer <= filters.MaxMileage.Value);
            if (filters.MaxPrice != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Price <= filters.MaxPrice.Value);
            if (filters.MinYear != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Year >= filters.MinYear.Value);
            
            //assign filtered list
            vehicles = vehicleQueryable.ToList();

            //apply sorting
            if (filters.Sort != null)
            {
                var sortMultiplier = 1;
                if (filters.SortAsc != null && filters.SortAsc.Value == false)
                    sortMultiplier = -1;
                switch (filters.Sort.Value)
                {
                    case FiltersSortType.Name:
                        if (filters.SortAsc.Value == true)
                            vehicles = vehicles.OrderBy(x => x.Brand + x.Model).ToList();
                        else
                            vehicles = vehicles.OrderByDescending(x => x.Brand + x.Model).ToList();
                        break;
                    case FiltersSortType.Price:
                        vehicles = vehicles.OrderBy(x => sortMultiplier * x.Price).ToList();
                        break;
                    case FiltersSortType.Mileage:
                        vehicles = vehicles.OrderBy(x => sortMultiplier * x.Odometer).ToList();
                        break;
                    case FiltersSortType.Power:
                        vehicles = vehicles.OrderBy(x => sortMultiplier * x.Power).ToList();
                        break;
                    default:
                        break;
                }
            }

            //apply pagination
            if (filters.StartAt != null && filters.NumberToGet != null)
                vehicles = vehicles.Skip(filters.StartAt.Value).Take(filters.NumberToGet.Value).ToList();

            return vehicles;
        }

        public async Task Create(VehicleCreateModel vehicle)
        {
            //check if location exists
            if (await locationRepository.GetById(vehicle.LocationId) == null)
                throw new Exception("Invalid location address!");

            //check if body type exists
            if (await bodyTypeRepository.GetByName(vehicle.BodyType) == null)
                throw new Exception("Invalid body type!");

            //check if given vehicle type exists and add otherwise
            if (await vehicleTypeRepository.GetById(vehicle.Brand, vehicle.Model) == null)
                await vehicleTypeRepository.Create(new() { Brand = vehicle.Brand, Model = vehicle.Model });

            var generatedId = Utilities.GetGUID();

            Vehicle newVehicle = new()
            {
                Id = generatedId,
                Image = vehicle.Image,
                Brand = vehicle.Brand,
                Model = vehicle.Model,
                BodyTypeName = vehicle.BodyType,
                Description = vehicle.Description,
                LocationId = vehicle.LocationId,
                Odometer = vehicle.Odometer,
                EngineSize = vehicle.EngineSize,
                Power = vehicle.Power,
                Price = vehicle.Price,
                Year = vehicle.Year,
                PowerTrainType = vehicle.PowerTrainType,
                DriveTrainType = vehicle.DriveTrainType,
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
                    newVehicle.Features.Add(await featureRepository.GetById(featureName));
                }
            }

            await statusRepository.Create(newStatus);
            await vehicleRepository.Create(newVehicle);
        }

        public async Task Update(string id, VehicleCreateModel updatedVehicle)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            if (currentVehicle == null)
                throw new KeyNotFoundException("Vehicle doesn't exist!");

            if (updatedVehicle.Image != "")
                currentVehicle.Image = updatedVehicle.Image;

            //check if location exists
            if (await locationRepository.GetById(updatedVehicle.LocationId) == null)
                throw new Exception("Invalid location address!");

            //check if body type exists
            if (await bodyTypeRepository.GetByName(updatedVehicle.BodyType) == null)
                throw new Exception("Invalid body type!");

            //check if given vehicle type exists and add otherwise
            if (await vehicleTypeRepository.GetById(updatedVehicle.Brand, updatedVehicle.Model) == null)
                await vehicleTypeRepository.Create(new() { Brand = updatedVehicle.Brand, Model = updatedVehicle.Model });

            currentVehicle.Brand = updatedVehicle.Brand;
            currentVehicle.Model = updatedVehicle.Model;
            currentVehicle.BodyTypeName = updatedVehicle.BodyType;
            currentVehicle.Description = updatedVehicle.Description;
            currentVehicle.Price = updatedVehicle.Price;
            currentVehicle.EngineSize = updatedVehicle.EngineSize;
            currentVehicle.Power = updatedVehicle.Power;
            currentVehicle.Odometer = updatedVehicle.Odometer;
            currentVehicle.LocationId = updatedVehicle.LocationId;
            currentVehicle.Year = updatedVehicle.Year;
            currentVehicle.Features = new List<Feature>();
            currentVehicle.PowerTrainType = updatedVehicle.PowerTrainType;
            currentVehicle.DriveTrainType = updatedVehicle.DriveTrainType;

            if (updatedVehicle.Features != null)
            {
                foreach (var featureName in updatedVehicle.Features)
                {
                    currentVehicle.Features.Add(await featureRepository.GetById(featureName));
                }
            }

            var features = new List<Feature>();

            if (updatedVehicle.Features != null)
            {
                foreach (var featureName in updatedVehicle.Features)
                {
                    features.Add(await featureRepository.GetById(featureName));
                }
            }

            await vehicleRepository.Update(currentVehicle);
        }

        public async Task UpdateStatus(string id, VehicleStatusUpdateModel updatedStatus)
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

            await statusRepository.Update(status);
        }   

        public async Task Delete(string id)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            if (currentVehicle == null)
                throw new Exception("Vehicle doesn't exist!");

            await vehicleRepository.Delete(currentVehicle);
        }
    }
}
