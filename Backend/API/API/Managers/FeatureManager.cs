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
    public class FeatureManager : IFeatureManager
    {
        private readonly IFeatureRepository featureRepository;

        public FeatureManager(IFeatureRepository repository)
        {
            featureRepository = repository;
        }

        public async Task<string> Create(FeatureCreateModel newFeature)
        {
            var feature = await featureRepository.GetByName(newFeature.Name);

            if (feature != null)
                throw new Exception("A feature with the given name already exists!");

            var id = Utilities.GetGUID();

            var createdFeature = new Feature()
            {
                Id = id,
                Name = newFeature.Name,
            };

            await featureRepository.Create(createdFeature);

            return id;
        }

        public async Task Delete(string id)
        {
            var feature = await featureRepository.GetById(id);

            if (feature == null)
                throw new Exception("Feature doesn't exist!");

            await featureRepository.Delete(feature);
        }

        public async Task<List<FeatureModel>> GetAll()
        {
            var features = await Task.FromResult(
                (await featureRepository.GetAll())
                .Select(x => new FeatureModel(x)).OrderBy(x => x.Name).ToList());

            return features;
        }

        public async Task Update(string id, FeatureCreateModel updatedFeature)
        {
            var feature = await featureRepository.GetById(id);
            var nameCheck = await featureRepository.GetByName(updatedFeature.Name);

            if (feature == null)
                throw new KeyNotFoundException("Feature doesn't exist!");

            if (nameCheck != null && nameCheck.Id != feature.Id)    //check if a different feature has the given name
                throw new Exception("A feature with the given name already exists!");

            feature.Name = updatedFeature.Name;

            await featureRepository.Update(feature);
        }
        
    }
}
