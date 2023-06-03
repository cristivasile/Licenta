using API.Entities;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using API.Models.Input;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class BodyTypeManager : IBodyTypeManager
    {
        private readonly IBodyTypeRepository bodyTypeRepository;
        private readonly IVehicleRepository vehicleRepository;

        public BodyTypeManager(IBodyTypeRepository bodyTypeRepository, IVehicleRepository vehicleRepository)
        {
            this.bodyTypeRepository = bodyTypeRepository;
            this.vehicleRepository = vehicleRepository;
        }

        public async Task Create(BodyTypeCreateModel newBodyType)
        {
            var check = await bodyTypeRepository.GetByName(newBodyType.Name);

            if (check != null)
                throw new Exception("Body type already exists!");

            var toCreate = new BodyType()
            {
               Name= newBodyType.Name,
            };

            await bodyTypeRepository.Create(toCreate);
        }

        public async Task Delete(string bodyTypeName)
        {
            var vehicles = await vehicleRepository.GetAll();

            if (vehicles.Any(x => x.BodyTypeName == bodyTypeName))
                throw new Exception("Cannot delete a body type that is present on a vehicle!");

            var toDelete = await bodyTypeRepository.GetByName(bodyTypeName);

            if (toDelete == null)
                throw new KeyNotFoundException("Body type not found!");

            await bodyTypeRepository.Delete(toDelete);
        }

        public async Task<List<string>> GetAll()
        {
            var bodyTypes = (await bodyTypeRepository.GetAll()).Select(x => x.Name).ToList();

            return bodyTypes;
        }
    }
}
