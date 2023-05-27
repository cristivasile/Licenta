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
    public class VehicleTypeManager : IVehicleTypeManager
    {
        private readonly IVehicleTypeRepository vehicleTypeRepository;

        public VehicleTypeManager(IVehicleTypeRepository vehicleTypeRepository)
        {
            this.vehicleTypeRepository = vehicleTypeRepository;
        }

        public async Task Delete(VehicleTypeDeleteModel toDelete)
        {
            var vehicleType = await vehicleTypeRepository.GetById(toDelete.Brand, toDelete.Model) ?? throw new Exception("Vehicle type doesn't exist!");
            await vehicleTypeRepository.Delete(vehicleType);
        }

        public async Task<List<VehicleTypeModel>> GetAll()
        {
            var vehicleTypes = (await vehicleTypeRepository.GetAll())
                .Select(x => new VehicleTypeModel(x)).ToList();
            return vehicleTypes;
        }

        public async Task<Dictionary<string, List<string>>> GetBrandModelDictionary()
        {
            var groupedVehicleTypes = (await vehicleTypeRepository.GetAll())
                 .GroupBy(x => x.Brand)
                .ToDictionary(x => x.Key, x => x.Select(x => x.Model).ToList());

            return groupedVehicleTypes;
        }
    }
}
