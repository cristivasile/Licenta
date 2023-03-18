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

        public BodyTypeManager(IBodyTypeRepository bodyTypeRepository)
        {
            this.bodyTypeRepository = bodyTypeRepository;
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
            var toDelete = await bodyTypeRepository.GetByName(bodyTypeName);

            if (toDelete == null)
                throw new Exception("Body type not found!");

            await bodyTypeRepository.Delete(toDelete);
        }

        public async Task<List<string>> GetAll()
        {
            var bodyTypes = (await bodyTypeRepository.GetAll()).Select(x => x.Name).ToList();

            return bodyTypes;
        }
    }
}
