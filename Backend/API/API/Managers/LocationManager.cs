using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class LocationManager : ILocationManager
    {
        private readonly ILocationRepository locationRepository;

        public LocationManager(ILocationRepository repository)
        {
            locationRepository = repository;
        }

        public async Task Create(LocationCreateModel newLocation)
        {
            var location = await locationRepository.GetByName(newLocation.Address);

            if (location != null)
                throw new Exception("Location already exists!");

            var createdLocation = new Location()
            {
                Address = newLocation.Address,
            };

            await locationRepository.Create(createdLocation); 
        }

        public async Task Delete(string name)
        {
            var location = await locationRepository.GetByName(name);

            if (location == null)
                throw new Exception("Location doesn't exist!");

            await locationRepository.Delete(location);
        }

        public async Task<List<LocationModel>> GetAll()
        {
            var locations = await Task.FromResult(
                (await locationRepository.GetAll())
                .Select(x => new LocationModel(x)).OrderBy(x => x.Address).ToList());
            return locations;
        }

        public async Task<LocationModel> GetByAddress(string name)
        {
            var location = await locationRepository.GetByName(name);

            //404 not found
            if (location == null)
                return null;

            var foundLocation = new LocationModel(location);
            return foundLocation;
        }

        public async Task Update(string name, LocationCreateModel updatedLocation)
        {
            var location = await locationRepository.GetByName(name);

            if (location == null)
                throw new Exception("Location doesn't exist!");

            location.Address = updatedLocation.Address;

            await locationRepository.Update(location);
        }

    }
}
