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
            var createdLocation = new Location()
            {
                Address = newLocation.Address,
            };

            await locationRepository.Create(createdLocation); 
        }

        public async Task<int> Delete(string name)
        {
            var foundLocation = await locationRepository.GetByName(name);

            ///404 not found
            if (foundLocation == null)
                return -1;

            await locationRepository.Delete(foundLocation);
            return 0;
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

        public async Task<int> Update(string name, LocationCreateModel updatedLocation)
        {
            var location = await locationRepository.GetByName(name);

            //404 not found
            if (location == null)
                return -1;

            location.Address = updatedLocation.Address;

            await locationRepository.Update(location);
            return 0;
        }

    }
}
