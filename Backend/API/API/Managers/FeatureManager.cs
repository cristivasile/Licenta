using API.Entities;
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

        public async Task Create(FeatureCreateModel newFeature)
        {
            var feature = await featureRepository.GetByName(newFeature.Name);

            if (feature != null)
                throw new Exception("Feature already exists!");

            var createdFeature = new Feature()
            {
                Name = newFeature.Name,
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

        public async Task Update(string name, FeatureCreateModel updatedFeature)
        {
            var feature = await featureRepository.GetByName(name);

            if (feature == null)
                throw new Exception("Feature doesn't exist!");

            feature.Name = updatedFeature.Name;

            await featureRepository.Update(feature);
        }
        
    }
}
