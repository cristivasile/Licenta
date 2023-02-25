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
    public class FeatureManager : IFeatureManager
    {
        private readonly IFeatureRepository featureRepository;

        public FeatureManager(IFeatureRepository repository)
        {
            featureRepository = repository;
        }

        public async Task<int> Create(FeatureCreateModel newFeature)
        {
            var foundFeature = await featureRepository.GetByName(newFeature.Name);

            ///feature already exists
            if (foundFeature != null)
                return -1;

            var createdFeature = new Feature()
            {
                Name = newFeature.Name,
                Desirability = newFeature.Desirability
            };

            await featureRepository.Create(createdFeature);
            return 0;
        }

        public async Task<int> Delete(string name)
        {
            var foundFeature = await featureRepository.GetByName(name);

            ///404 not found
            if (foundFeature == null)
                return -1;

            await featureRepository.Delete(foundFeature);
            return 0;
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

        public async Task<int> Update(string name, FeatureCreateModel updatedFeature)
        {
            var feature = await featureRepository.GetByName(name);

            //404 not found
            if (feature == null)
                return -1;

            feature.Name = updatedFeature.Name;
            feature.Desirability = feature.Desirability;

            await featureRepository.Update(feature);
            return 0;
        }
        
    }
}
