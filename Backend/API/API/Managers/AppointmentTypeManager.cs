using API.Entities;
using API.Helpers;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using API.Models.Input;
using API.Models.Return;
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
            var locationCheck = locationRepository.GetById(toCreate.LocationId);

            if (locationCheck == null)
                throw new System.Exception("Location does not exist!");

            var appointmentType = new AppointmentType() 
            {
                Id = Utilities.GetGUID(),
                LocationId = toCreate.LocationId,
                Name = toCreate.Name,
                Duration = toCreate.Duration,
            };

            await appointmentTypeRepository.Create(appointmentType);
        }

        public async Task Delete(string id)
        {
            var appointmentType = await appointmentTypeRepository.GetById(id);

            if (appointmentType == null)
                throw new KeyNotFoundException();

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
