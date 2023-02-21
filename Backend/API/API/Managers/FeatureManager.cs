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

        public async Task Create(FeatureCreateModel newFeature)
        {
            var createdFeature = new Feature()
            {
                Id = Utilities.GetGUID(),
                Name = newFeature.Name,
                Desirability = newFeature.Desirability
            };

            await featureRepository.Create(createdFeature);
        }

        public async Task<int> Delete(string id)
        {
            var foundFeature = await featureRepository.GetById(id);

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

        public async Task<FeatureModel> GetById(string id)
        {
            var feature = await featureRepository.GetById(id);

            //404 not found
            if (feature == null)
                return null;

            var foundFeature = new FeatureModel(feature);
            return foundFeature;
        }

        public async Task<int> Update(string id, FeatureCreateModel updatedFeature)
        {
            var feature = await featureRepository.GetById(id);

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
