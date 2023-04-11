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
    public class LocationManager : ILocationManager
    {
        private readonly ILocationRepository locationRepository;
        private readonly IVehicleRepository vehicleRepository;
        public LocationManager(ILocationRepository locationRepository, IVehicleRepository vehicleRepository)
        {
            this.locationRepository = locationRepository;
            this.vehicleRepository = vehicleRepository;
        }

        public async Task<string> Create(LocationCreateModel newLocation)
        {
            var location = await locationRepository.GetByCityAndAddress(newLocation.City, newLocation.Address);

            if (location != null)
                throw new Exception("Location already exists!");

            string id = Utilities.GetGUID();

            var createdLocation = new Location()
            {
                Id = id,
                City = newLocation.City,
                Address = newLocation.Address,
            };

            await locationRepository.Create(createdLocation);
            return id;
        }

        public async Task Delete(string id)
        {
            var location = await locationRepository.GetById(id);

            if (location == null)
                throw new KeyNotFoundException("Location doesn't exist!");

            var vehiclesList = await vehicleRepository.GetByLocationId(location.Id);

            if (vehiclesList.Count > 0)
                throw new Exception($"Location has {vehiclesList.Count} vehicle(s)!");

            await locationRepository.Delete(location);
        }

        public async Task<List<LocationModel>> GetAll()
        {
            var locations = await Task.FromResult(
                (await locationRepository.GetAll())
                .Select(x => new LocationModel(x)).OrderBy(x => x.Address).ToList());
            return locations;
        }

        public async Task Update(string id, LocationCreateModel updatedLocation)
        {
            var location = await locationRepository.GetById(id);

            if (location == null)
                throw new Exception("Location doesn't exist!");

            location.City = updatedLocation.City;
            location.Address = updatedLocation.Address;

            await locationRepository.Update(location);
        }

    }
}
