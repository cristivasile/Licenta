using API.Entities;
using API.Helpers;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using API.Models.Input;
using API.Models.Return;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace API.Managers
{
    public class VehicleManager : IVehicleManager
    {
        private static readonly int maxImageSize = 1048576; //1 MB
        private static readonly int maxThumbnailImageSize = 102400; //100 KB
        private readonly IVehicleRepository vehicleRepository;
        private readonly IFeatureRepository featureRepository;
        private readonly IBodyTypeRepository bodyTypeRepository;
        private readonly IVehicleTypeRepository vehicleTypeRepository;
        private readonly IStatusRepository statusRepository;
        private readonly ILocationRepository locationRepository;
        private readonly IThumbnailRepostory thumbnailRepository;
        private readonly IPictureRepository pictureRepository;

        public VehicleManager(IVehicleRepository vehicleRepository, IFeatureRepository featureRepository, ILocationRepository locationRepository,
            IBodyTypeRepository bodyTypeRepository, IVehicleTypeRepository vehicleTypeRepository, IStatusRepository statusRepository, 
            IPictureRepository pictureRepository, IThumbnailRepostory thumbnailRepository)
        {
            this.vehicleRepository = vehicleRepository;
            this.featureRepository = featureRepository;
            this.bodyTypeRepository = bodyTypeRepository;
            this.vehicleTypeRepository = vehicleTypeRepository;
            this.statusRepository = statusRepository;
            this.locationRepository = locationRepository;
            this.pictureRepository = pictureRepository;
            this.thumbnailRepository = thumbnailRepository;
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

            var images = await pictureRepository.GetByVehicleId(vehicle.Id);
            if(images.Count > 0 && images[0] != null)
                returned.Image = images[0].Id;
            else
                returned.Image = "";

            return returned;
        }

        public async Task<FullVehicleModel> GetByIdExtended(string id)
        {
            var vehicle = await vehicleRepository.GetById(id);

            if (vehicle == null)
                return null;

            var returned = new FullVehicleModel(vehicle);

            var images = await pictureRepository.GetByVehicleId(vehicle.Id);
            if (images.Count > 0 && images[0] != null)
                returned.Image = images[0].Id;
            else
                returned.Image = "";

            return returned;
        }

        /// <summary>
        /// Given a queryable collection applies filters and sorting.
        /// </summary>
        private IEnumerable<VehicleModel> ApplyFilters(IQueryable<VehicleModel> vehicleQueryable, VehicleFiltersModel filters)
        {
            if (filters.Brand != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Brand.ToLower() == filters.Brand.ToLower());
            if (filters.MaxMileage != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Odometer <= filters.MaxMileage.Value);
            if (filters.MinPrice != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Price >= filters.MinPrice.Value);
            if (filters.MaxPrice != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Price <= filters.MaxPrice.Value);
            if (filters.MinPower != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Power >= filters.MinPower.Value);
            if (filters.MaxPower != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Power <= filters.MaxPower.Value);
            if (filters.MinYear != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Year >= filters.MinYear.Value);
            if (filters.Transmission != null)
            {
                var filterString = filters.Transmission.ToString();
                vehicleQueryable = vehicleQueryable.Where(x => x.TransmissionType == filterString);
            }

            //assign filtered list
            var result = vehicleQueryable.ToList();

            //apply sorting
            if (filters.Sort != null)
            {
                var sortMultiplier = 1;
                if (filters.SortAsc != null && filters.SortAsc.Value == false)
                    sortMultiplier = -1;

                switch (filters.Sort.Value)
                {
                    case FiltersSortTypeEnum.Name:
                        if (filters.SortAsc != null && filters.SortAsc.Value == false)
                            result = result.OrderByDescending(x => x.Brand + x.Model).ToList();
                        else
                            result = result.OrderBy(x => x.Brand + x.Model).ToList();
                        break;
                    case FiltersSortTypeEnum.Price:
                        result = result.OrderBy(x => sortMultiplier * x.Price).ToList();
                        break;
                    case FiltersSortTypeEnum.Mileage:
                        result = result.OrderBy(x => sortMultiplier * x.Odometer).ToList();
                        break;
                    case FiltersSortTypeEnum.Power:
                        result = result.OrderBy(x => sortMultiplier * x.Power).ToList();
                        break;
                    default:
                        break;
                }
            }

            return result;
        }

        private IEnumerable<VehicleModel> ApplyPagination(IEnumerable<VehicleModel> vehicles, VehiclePaginationModel pagination)
        {
            if (pagination.StartAt != null && pagination.NumberToGet != null)
                return vehicles.Skip(pagination.StartAt.Value).Take(pagination.NumberToGet.Value);
            else
                return vehicles;
        }

        private async Task<VehiclesPageModel> GetFilteredPage(IEnumerable<VehicleModel> vehicles, VehicleFiltersModel filters)
        {
            vehicles = ApplyFilters(vehicles.AsQueryable(), filters);
            var count = vehicles.Count();
            vehicles = ApplyPagination(vehicles, filters);

            foreach (var vehicle in vehicles) 
            {
                var thumbnail = await thumbnailRepository.GetByVehicleId(vehicle.Id);
                if (thumbnail != null)
                    vehicle.Image = thumbnail.Base64Image;
                else
                    vehicle.Image = "";
            }

            return new()
            {
                TotalCount = count,
                Vehicles = vehicles.ToList(),
            };
        }

        public async Task<VehiclesPageModel> GetAll(VehicleFiltersModel filters)
        {
            var vehicles = (await vehicleRepository.GetAll())
                                .Select(x => new VehicleModel(x));

            return await GetFilteredPage(vehicles, filters);
        }

        public async Task<VehiclesPageModel> GetAvailable(VehicleFiltersModel filters)
        {
            var vehicles = (await vehicleRepository.GetAvailable())
                                .Select(x => new VehicleModel(x));

            return await GetFilteredPage(vehicles, filters);
        }

        public async Task<Dictionary<string, List<string>>> GetBrandModelDictionary()
        {
            var vehicleTypes = await vehicleTypeRepository.GetAll();
            return vehicleTypes.GroupBy(type => type.Brand)
                .ToDictionary(type => type.Key, type => type.Select(x => x.Model).ToList());
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
            var thumbnailId = Utilities.GetGUID();

            Vehicle newVehicle = new()
            {
                Id = generatedId,
                Brand = inputVehicle.Brand,
                Model = inputVehicle.Model,
                BodyTypeName = inputVehicle.BodyType,
                Description = inputVehicle.Description,
                LocationId = inputVehicle.LocationId,
                Odometer = inputVehicle.Odometer,
                EngineSize = inputVehicle.EngineSize,
                Power = inputVehicle.Power,
                Torque = inputVehicle.Torque,
                Price = inputVehicle.Price,
                Year = inputVehicle.Year,
                PowerTrainType = inputVehicle.PowerTrainType,
                DriveTrainType = inputVehicle.DriveTrainType,
                TransmissionType = inputVehicle.TransmissionType,
                Features = featuresList
            };

            Status newStatus = new()
            {
                VehicleId = newVehicle.Id,
                IsSold = false,
                DateAdded = System.DateTime.Now,
                DateSold = null
            };

            Thumbnail newThumbnail = new()
            {
                Id = thumbnailId,
                Base64Image = inputVehicle.ThumbnailImage,
            };

            Picture newImage = new()
            {
                Id = Utilities.GetGUID(),
                Base64Image = inputVehicle.Image,
                VehicleId = newVehicle.Id,
            };

            await vehicleRepository.Create(newVehicle);
            await thumbnailRepository.Create(newThumbnail);
            await statusRepository.Create(newStatus);
            await pictureRepository.Create(newImage);
        }

        public async Task Update(string id, VehicleCreateModel updatedVehicle)
        {
            var currentVehicle = await vehicleRepository.GetById(id);

            if (currentVehicle == null)
                throw new KeyNotFoundException("Vehicle doesn't exist!");

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

            //remove old thumbnail
            var thumbnail = await thumbnailRepository.GetByVehicleId(currentVehicle.Id);
            if (thumbnail != null)
                await thumbnailRepository.Delete(thumbnail);

            //remove old pictures
            var images = await pictureRepository.GetByVehicleId(currentVehicle.Id);
            foreach (var image in images)
                await pictureRepository.Delete(image);

            Thumbnail newThumbnail = new()
            {
                Id = Utilities.GetGUID(),
                Base64Image = updatedVehicle.ThumbnailImage,
                VehicleId = currentVehicle.Id,
            };

            Picture newImage = new()
            {
                Id = Utilities.GetGUID(),
                Base64Image = updatedVehicle.Image,
                VehicleId = currentVehicle.Id,
            };

            currentVehicle.Brand = updatedVehicle.Brand;
            currentVehicle.Model = updatedVehicle.Model;
            currentVehicle.BodyTypeName = updatedVehicle.BodyType;
            currentVehicle.Description = updatedVehicle.Description;
            currentVehicle.Price = updatedVehicle.Price;
            currentVehicle.EngineSize = updatedVehicle.EngineSize;
            currentVehicle.Power = updatedVehicle.Power;
            currentVehicle.Torque = updatedVehicle.Torque;
            currentVehicle.Odometer = updatedVehicle.Odometer;
            currentVehicle.LocationId = updatedVehicle.LocationId;
            currentVehicle.Year = updatedVehicle.Year;
            currentVehicle.Features = featuresList;
            currentVehicle.PowerTrainType = updatedVehicle.PowerTrainType;
            currentVehicle.DriveTrainType = updatedVehicle.DriveTrainType;
            currentVehicle.TransmissionType = updatedVehicle.TransmissionType;

            await vehicleRepository.Update(currentVehicle);
            await thumbnailRepository.Create(newThumbnail);
            await pictureRepository.Create(newImage);
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

            var brand = currentVehicle.Brand;
            var model = currentVehicle.Model;

            //check if brand and model is still used
            var vehicles = await vehicleRepository.GetAll();
            var filteredVehicles = vehicles.Where(x => x.Brand == brand && x.Model == model);

            //remove if necessary
            if (filteredVehicles.Count() == 0)
                await vehicleTypeRepository.Delete(await vehicleTypeRepository.GetById(brand, model));

            //remove thumbnail
            var thumbnail = await thumbnailRepository.GetByVehicleId(currentVehicle.Id);
            if (thumbnail != null)
                await thumbnailRepository.Delete(thumbnail);

            //remove pictures
            var images = await pictureRepository.GetByVehicleId(currentVehicle.Id);
            foreach (var image in images)
                await pictureRepository.Delete(image);
        }
    }
}
