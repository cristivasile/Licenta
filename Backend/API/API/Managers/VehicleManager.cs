using API.Entities;
using API.Helpers;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using API.Migrations;
using API.Models.Input;
using API.Models.Return;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace API.Managers
{
    public class VehicleManager : IVehicleManager
    {
        /// <summary>
        /// Max image sizes accepted by the manager, if the frontend sends larger images the controller will return BadRequest.
        /// The frontend is tasked with compressing images before upload.
        /// </summary>
        private static readonly int maxImageSize = 2621440; //2.5 MB in bytes
        private static readonly int maxThumbnailImageSize = 512000; //500 KB in bytes

        private static readonly int maxDescriptionLength = 2500; 

        private readonly IVehicleRepository vehicleRepository;
        private readonly IVehicleViewRepository vehicleViewRepository;
        private readonly IFeatureRepository featureRepository;
        private readonly IBodyTypeRepository bodyTypeRepository;
        private readonly IVehicleTypeRepository vehicleTypeRepository;
        private readonly IStatusRepository statusRepository;
        private readonly ILocationRepository locationRepository;
        private readonly IThumbnailRepostory thumbnailRepository;
        private readonly IPictureRepository pictureRepository;
        private readonly IRecommendationManager recommendationManager;
        private readonly UserManager<User> userManager;

        public VehicleManager(IVehicleRepository vehicleRepository, IVehicleViewRepository vehicleViewRepository, IFeatureRepository featureRepository, 
            ILocationRepository locationRepository, IBodyTypeRepository bodyTypeRepository, IVehicleTypeRepository vehicleTypeRepository, IStatusRepository statusRepository, 
            IPictureRepository pictureRepository, IThumbnailRepostory thumbnailRepository, IRecommendationManager recommendationManager, UserManager<User> userManager)
        {
            this.vehicleRepository = vehicleRepository;
            this.vehicleViewRepository = vehicleViewRepository;
            this.featureRepository = featureRepository;
            this.bodyTypeRepository = bodyTypeRepository;
            this.vehicleTypeRepository = vehicleTypeRepository;
            this.statusRepository = statusRepository;
            this.locationRepository = locationRepository;
            this.pictureRepository = pictureRepository;
            this.thumbnailRepository = thumbnailRepository;
            this.recommendationManager = recommendationManager;
            this.userManager = userManager;
        }

        public Task<int> GetNumberOfVehicles()
        {
            return vehicleRepository.GetNumberOfVehicles();
        }

        public Task<int> GetNumberOfAvailableVehicles()
        {
            return vehicleRepository.GetNumberOfAvailableVehicles();
        }

        public async Task<DetailedVehicleModel> GetById(string id, string username)
        {
            var vehicle = await vehicleRepository.GetById(id) ?? throw new KeyNotFoundException();

            //add a View entry
            var user = await userManager.FindByNameAsync(username) ?? throw new Exception("User does not exist!");
            var newView = new VehicleView
            {
                Id = Utilities.GetGUID(),
                Date = DateTime.Now,
                UserId = user.Id,
                VehicleId = vehicle.Id,
            };

            await vehicleViewRepository.Create(newView);

            return new DetailedVehicleModel(vehicle);
        }

        public async Task<FullVehicleModel> GetByIdExtended(string id)
        {
            var vehicle = await vehicleRepository.GetById(id) ?? throw new KeyNotFoundException();

            return new FullVehicleModel(vehicle);
        }

        /// <summary>
        /// Given a queryable collection applies filters and sorting.
        /// </summary>
        private async Task<IEnumerable<VehicleModel>> ApplyFiltersAsync(IQueryable<VehicleModel> vehicleQueryable, VehicleFiltersModel filters)
        {
            if (filters.Brand != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Brand.ToLower() == filters.Brand.ToLower());
            if (filters.Model != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.Model.ToLower() == filters.Model.ToLower());
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
            if (filters.BodyType != null)
                vehicleQueryable = vehicleQueryable.Where(x => x.BodyType == filters.BodyType);
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
                    case FiltersSortTypeEnum.Recommended:

                        if (filters.Username == null)
                            throw new Exception("User cannot be null for recommended sort type!");

                        var user = await userManager.FindByNameAsync(filters.Username) ?? throw new KeyNotFoundException(); //should never happen

                        result = await recommendationManager.SortByRecommended(result, user.Id);
                        break;
                    default:
                        throw new Exception("Unsupported sort type!");
                }
            }

            return result;
        }

        private static IEnumerable<VehicleModel> ApplyPagination(IEnumerable<VehicleModel> vehicles, VehiclePaginationModel pagination)
        {
            if (pagination.StartAt != null && pagination.NumberToGet != null)
                return vehicles.Skip(pagination.StartAt.Value).Take(pagination.NumberToGet.Value);
            else
                return vehicles;
        }

        private async Task<VehiclesPageModel> GetFilteredPage(IEnumerable<VehicleModel> vehicles, VehicleFiltersModel filters)
        {
            vehicles = await ApplyFiltersAsync(vehicles.AsQueryable(), filters);
            var count = vehicles.Count();
            vehicles = ApplyPagination(vehicles, filters);

            foreach (var vehicle in vehicles) 
            {
                var thumbnail = await thumbnailRepository.GetByVehicleId(vehicle.Id);
                if (thumbnail != null)
                    vehicle.Thumbnail = thumbnail.Base64Image;
                else
                    vehicle.Thumbnail = "";
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
            foreach(var image in inputVehicle.Images)
                if(image.Length > maxImageSize)
                    throw new Exception("An image is too large!");

            if (inputVehicle.ThumbnailImage.Length > maxThumbnailImageSize)
                throw new Exception("Thumbnail image is too large!");

            if (inputVehicle.Brand == "")
                throw new Exception("Brand cannot be empty!");

            if (inputVehicle.Model == "")
                throw new Exception("Model cannot be empty!");

            if (inputVehicle.Description.Length > maxDescriptionLength)
                throw new Exception($"Cannot have a description longer than {maxDescriptionLength} characters!");

            if (inputVehicle.Power < 0)
                throw new Exception("Power cannot be less than 0!");

            if (inputVehicle.Torque < 0)
                throw new Exception("Torque cannot be less than 0!");

            if (inputVehicle.Odometer < 0)
                throw new Exception("Mileage cannot be less than 0!");

            if (inputVehicle.EngineSize != null && inputVehicle.EngineSize <= 0)
                throw new Exception("Engine size cannot be less than or equal to 0!");

            if (inputVehicle.Price <= 0)
                throw new Exception("Price cannot be less than or equal to 0!");

            if (inputVehicle.Year < 1886)
                throw new Exception("Year cannot be lass than 1886!");
            else if (inputVehicle.Year > DateTime.Now.Year)
                throw new Exception($"Year cannot be larger than {DateTime.Now.Year}!");
            
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
                    var feature = await featureRepository.GetById(featureName) ?? throw new Exception("Invalid feature given!");
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
                VehicleId = newVehicle.Id,
                Base64Image = inputVehicle.ThumbnailImage,
            };

            List<Picture> newImages = new();
            foreach (var image in inputVehicle.Images)
                newImages.Add(new()
                {
                    Id = Utilities.GetGUID(),
                    Base64Image = image,
                    VehicleId = newVehicle.Id,
                });

            await vehicleRepository.Create(newVehicle);
            await thumbnailRepository.Create(newThumbnail);
            await statusRepository.Create(newStatus);

            //add the images
            foreach(var newImage in newImages)
                await pictureRepository.Create(newImage);
        }

        public async Task Update(string id, VehicleCreateModel updatedVehicle)
        {
            var currentVehicle = await vehicleRepository.GetById(id) ?? throw new KeyNotFoundException();

            //will throw an exception if validation fails
            await ValidateInputVehicle(updatedVehicle);

            //validate features
            List<Feature> featuresList = new();
            if (updatedVehicle.Features != null)
            {
                foreach (var featureName in updatedVehicle.Features)
                {
                    var feature = await featureRepository.GetById(featureName) ?? throw new Exception("Invalid feature given!");
                    featuresList.Add(feature);
                }
            }

            //check if given vehicle type exists and add otherwise
            if (await vehicleTypeRepository.GetById(updatedVehicle.Brand, updatedVehicle.Model) == null)
                await vehicleTypeRepository.Create(new() { Brand = updatedVehicle.Brand, Model = updatedVehicle.Model });

            //remove old thumbnail if modified
            var thumbnail = await thumbnailRepository.GetByVehicleId(currentVehicle.Id);
            if (thumbnail != null && thumbnail.Base64Image != updatedVehicle.ThumbnailImage)
            {
                await thumbnailRepository.Delete(thumbnail);

                Thumbnail newThumbnail = new()
                {
                    Id = Utilities.GetGUID(),
                    Base64Image = updatedVehicle.ThumbnailImage,
                    VehicleId = currentVehicle.Id,
                };
                await thumbnailRepository.Create(newThumbnail);
            }

            //remove old pictures if modified
            var images = await pictureRepository.GetByVehicleId(currentVehicle.Id);
            var base64Images = images.Select(x => x.Base64Image).ToHashSet();
            foreach (var updatedImage in updatedVehicle.Images)
            {
                if(images.Count != updatedVehicle.Images.Count //length differs
                    || !base64Images.Contains(updatedImage))    //an image is missing
                {
                    foreach (var image in images)
                        await pictureRepository.Delete(image);

                    List<Picture> newImages = new();
                    foreach (var image in updatedVehicle.Images)
                        newImages.Add(new()
                        {
                            Id = Utilities.GetGUID(),
                            Base64Image = image,
                            VehicleId = currentVehicle.Id,
                        });

                    //add the images
                    foreach (var newImage in newImages)
                        await pictureRepository.Create(newImage);

                    break;
                }
            }

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
        }

        public async Task UpdateStatus(string id, VehicleStatusUpdateModel updatedStatus)
        {
            var currentVehicle = await vehicleRepository.GetById(id) ?? throw new KeyNotFoundException();

            var status = currentVehicle.Status;
            if (updatedStatus.IsSold)
            {
                if (updatedStatus.Username == null)
                    throw new Exception("A sold vehicle must be purchased by an user!");

                var user = await userManager.FindByNameAsync(updatedStatus.Username) ?? throw new Exception("User does not exist!");

                status.DateSold = DateTime.Now;
                status.IsSold = true;
                status.PurchaserUserId = user.Id;
            }
            else
            {
                status.DateSold = null;
                status.IsSold = false;
            }

            await statusRepository.Update(status);
        }

        public async Task UpdateImages(string id, List<string> updatedImages)
        {
            var currentVehicle = await vehicleRepository.GetById(id) ?? throw new KeyNotFoundException();

            //check images
            foreach (var image in updatedImages)
                if (image.Length > maxImageSize)
                    throw new Exception("An image is too large!");

            //remove new pictures
            var images = await pictureRepository.GetByVehicleId(currentVehicle.Id);
            foreach (var image in images)
                await pictureRepository.Delete(image);

            //add new pictures
            List<Picture> newImages = new();
            foreach (var image in updatedImages)
                newImages.Add(new()
                {
                    Id = Utilities.GetGUID(),
                    Base64Image = image,
                    VehicleId = currentVehicle.Id,
                });

            foreach (var newImage in newImages)
                await pictureRepository.Create(newImage);
        }

        public async Task Delete(string id)
        {
            var currentVehicle = await vehicleRepository.GetById(id) ?? throw new KeyNotFoundException();

            await vehicleRepository.Delete(currentVehicle);

            var brand = currentVehicle.Brand;
            var model = currentVehicle.Model;

            //check if brand and model is still used
            var vehicles = await vehicleRepository.GetAll();
            var filteredVehicles = vehicles.Where(x => x.Brand == brand && x.Model == model);

            //remove if necessary
            if (filteredVehicles.Any())
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
