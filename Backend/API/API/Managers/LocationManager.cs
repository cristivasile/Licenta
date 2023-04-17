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
        private readonly IScheduleRepository scheduleRepository;
        public LocationManager(ILocationRepository locationRepository, IScheduleRepository scheduleRepository, 
            IVehicleRepository vehicleRepository)
        {
            this.locationRepository = locationRepository;
            this.scheduleRepository = scheduleRepository;
            this.vehicleRepository = vehicleRepository;
        }

        public async Task<string> Create(LocationCreateModel newLocation)
        {
            var location = await locationRepository.GetByCityAndAddress(newLocation.City, newLocation.Address);

            if (location != null)
                throw new Exception("Location already exists!");

            string locationId = Utilities.GetGUID();

            var createdLocation = new Location()
            {
                Id = locationId,
                City = newLocation.City,
                Address = newLocation.Address,
            };

            //check schedules
            List<Schedule> newSchedules = new();
            foreach (var newSchedule in newLocation.Schedules)
            {
                try
                {
                    newSchedules.Add(new Schedule()
                    {
                        LocationId = locationId,
                        Weekday = newSchedule.Weekday,
                        OpeningTime = TimeSpan.Parse(newSchedule.OpeningTime),
                        ClosingTime = TimeSpan.Parse(newSchedule.ClosingTime)
                    });
                }
                catch
                {
                    throw new Exception("Invalid TimeSpan format!");
                }
            }

            //create location
            await locationRepository.Create(createdLocation);
            
            //create schedules
            foreach(var createdSchedule in newSchedules)
                await scheduleRepository.Create(createdSchedule);
            
            return locationId;
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

            //check schedules
            List<Schedule> updatedSchedules = new();
            foreach (var newSchedule in updatedLocation.Schedules)
            {
                try
                {
                    updatedSchedules.Add(new Schedule()
                    {
                        LocationId = id,
                        Weekday = newSchedule.Weekday,
                        OpeningTime = TimeSpan.Parse(newSchedule.OpeningTime),
                        ClosingTime = TimeSpan.Parse(newSchedule.ClosingTime)
                    });
                }
                catch
                {
                    throw new Exception("Invalid TimeSpan format!");
                }
            }

            //update location
            await locationRepository.Update(location);

            //remove old schedules
            var oldSchedules = await scheduleRepository.GetByLocationId(id);
            foreach(var oldSchedule in oldSchedules)
                await scheduleRepository.Delete(oldSchedule);

            //add updated schedules
            foreach(var updatedSchedule in updatedSchedules)
                await scheduleRepository.Create(updatedSchedule);


        }

    }
}
