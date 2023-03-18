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
        private static readonly int maxImageSize = 1048576; //1 MB
        private static readonly int maxThumbnailImageSize = 10240; //10 KB
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

        /// <summary>
        /// Validates fields of an input vehicle.
        /// Doesn't check the features list, must be done separately.
        /// </summary>
        private async Task ValidateInputVehicle(VehicleCreateModel inputVehicle)
        {
            if (inputVehicle.Image.Length > maxImageSize)
                throw new Exception("Image is too large!");

            if (inputVehicle.ThumbnailImage.Length > maxThumbnailImageSize)
                throw new Exception("Thumbnail image is too large!");

            if (inputVehicle.Brand == "")
                throw new Exception("Brand cannot be empty!");

            if (inputVehicle.Model == "")
                throw new Exception("Model cannot be empty!");

            //check if location exists
            if (await locationRepository.GetById(inputVehicle.LocationId) == null)
                throw new Exception("Invalid location!");

            //check if body type exists
            if (await bodyTypeRepository.GetByName(inputVehicle.BodyType) == null)
                throw new Exception("Invalid body type!");
        }

        public async Task Create(VehicleCreateModel inputVehicle)
        {
            inputVehicle.Brand = Utilities.CapitalizeOnlyFirstLetter(inputVehicle.Brand);
            inputVehicle.Model = Utilities.CapitalizeOnlyFirstLetter(inputVehicle.Model);
            
            //will throw an exception if validation fails
            await ValidateInputVehicle(inputVehicle);

            //validate features
            List<Feature> featuresList = new();
            if (inputVehicle.Features != null)
            {
                foreach (var featureName in inputVehicle.Features)
                {
                    var feature = await featureRepository.GetById(featureName);
                    if (feature == null)
                        throw new Exception("Invalid feature given!");

                    featuresList.Add(feature);
                }
            }

            //check if given vehicle type exists and add otherwise
            if (await vehicleTypeRepository.GetById(inputVehicle.Brand, inputVehicle.Model) == null)
                await vehicleTypeRepository.Create(new() { Brand = inputVehicle.Brand, Model = inputVehicle.Model });

            var generatedId = Utilities.GetGUID();

            Vehicle newVehicle = new()
            {
                Id = generatedId,
                Image = inputVehicle.Image,
                ThumbnailImage = inputVehicle.ThumbnailImage,
                Brand = inputVehicle.Brand,
                Model = inputVehicle.Model,
                BodyTypeName = inputVehicle.BodyType,
                Description = inputVehicle.Description,
                LocationId = inputVehicle.LocationId,
                Odometer = inputVehicle.Odometer,
                EngineSize = inputVehicle.EngineSize,
                Power = inputVehicle.Power,
                Price = inputVehicle.Price,
                Year = inputVehicle.Year,
                PowerTrainType = inputVehicle.PowerTrainType,
                DriveTrainType = inputVehicle.DriveTrainType,
                Features = featuresList
            };

            Status newStatus = new()
            {
                VehicleId = newVehicle.Id,
                IsSold = false,
                DateAdded = System.DateTime.Now,
                DateSold = null
            };

            await statusRepository.Create(newStatus);
            await vehicleRepository.Create(newVehicle);
        }

        public async Task Update(string id, VehicleCreateModel updatedVehicle)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            if (currentVehicle == null)
                throw new KeyNotFoundException("Vehicle doesn't exist!");

            updatedVehicle.Brand = Utilities.CapitalizeOnlyFirstLetter(updatedVehicle.Brand);
            updatedVehicle.Model = Utilities.CapitalizeOnlyFirstLetter(updatedVehicle.Model);

            //will throw an exception if validation fails
            await ValidateInputVehicle(updatedVehicle);

            //validate features
            List<Feature> featuresList = new();
            if (updatedVehicle.Features != null)
            {
                foreach (var featureName in updatedVehicle.Features)
                {
                    var feature = await featureRepository.GetById(featureName);
                    if (feature == null)
                        throw new Exception("Invalid feature given!");

                    featuresList.Add(feature);
                }
            }

            //check if given vehicle type exists and add otherwise
            if (await vehicleTypeRepository.GetById(updatedVehicle.Brand, updatedVehicle.Model) == null)
                await vehicleTypeRepository.Create(new() { Brand = updatedVehicle.Brand, Model = updatedVehicle.Model });

            currentVehicle.Image = updatedVehicle.Image;
            currentVehicle.ThumbnailImage = updatedVehicle.ThumbnailImage;
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
            currentVehicle.Features = featuresList;
            currentVehicle.PowerTrainType = updatedVehicle.PowerTrainType;
            currentVehicle.DriveTrainType = updatedVehicle.DriveTrainType;

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
