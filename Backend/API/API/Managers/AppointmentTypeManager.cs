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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace API.Managers
{
    public class AppointmentTypeManager : IAppointmentTypeManager
    {
        private readonly IAppointmentTypeRepository appointmentTypeRepository;
        private readonly ILocationRepository locationRepository;

        public AppointmentTypeManager(IAppointmentTypeRepository appointmentTypeRepository, ILocationRepository locationRepository)
        {
            this.appointmentTypeRepository = appointmentTypeRepository;
            this.locationRepository = locationRepository;   
        }

        public async Task Create(AppointmentTypeCreateModel toCreate)
        {
            var locationCheck = await locationRepository.GetById(toCreate.LocationId);

            if (locationCheck == null)
                throw new Exception("Location does not exist!");

            var nameCheck = await appointmentTypeRepository.GetByLocationId(toCreate.LocationId);

            foreach (var type in nameCheck)
                if (type.Name.ToLower() == toCreate.Name.ToLower())
                    throw new Exception("An appointment type with this name already exists!");

            var appointmentType = new AppointmentType() 
            {
                Id = Utilities.GetGUID(),
                LocationId = toCreate.LocationId,
                Name = toCreate.Name.Trim(),
                Duration = toCreate.Duration,
            };

            await appointmentTypeRepository.Create(appointmentType);
        }

        public async Task Delete(string id)
        {
            var appointmentType = await appointmentTypeRepository.GetById(id);

            if (appointmentType == null)
                throw new KeyNotFoundException();

            //TODO - delete appointments

            await appointmentTypeRepository.Delete(appointmentType);
        }

        public async Task<List<AppointmentTypeModel>> GetByLocationId(string locationId)
        {
            var appointmentTypes = await appointmentTypeRepository.GetByLocationId(locationId);

            return appointmentTypes.Select(x => new AppointmentTypeModel(x)).ToList();
        }

        public async Task Update(string id, AppointmentTypeCreateModel toUpdate)
        {
            var appointmentType = await appointmentTypeRepository.GetById(id);

            if (appointmentType == null) 
                throw new KeyNotFoundException();

            appointmentType.Duration = toUpdate.Duration;
            appointmentType.Name = toUpdate.Name;
        
            await appointmentTypeRepository.Update(appointmentType);
        }
    }
}
