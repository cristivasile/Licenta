using API.Entities;
using API.Helpers;
using API.Interfaces;
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

        public async Task Create(FeatureCreateModel newFeature)
        {
            var createdFeature = new Feature()
            {
                Name = newFeature.Name,
                Desirability = newFeature.Desirability
            };

            await featureRepository.Create(createdFeature);
        }

        public async Task Delete(string name)
        {
            var feature = await featureRepository.GetByName(name);

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

        public async Task<FeatureModel> GetByName(string name)
        {
            var feature = await featureRepository.GetByName(name);

            //404 not found
            if (feature == null)
                return null;

            var foundFeature = new FeatureModel(feature);
            return foundFeature;
        }

        public async Task Update(string name, FeatureCreateModel updatedFeature)
        {
            var feature = await featureRepository.GetByName(name);

            if (feature == null)
                throw new Exception("Feature doesn't exist!");

            feature.Name = updatedFeature.Name;
            feature.Desirability = feature.Desirability;

            await featureRepository.Update(feature);
        }
        
    }
}
