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
    public class WheelManager : IWheelManager
    {
        private readonly IWheelRepository wheelRepository;

        public WheelManager(IWheelRepository repository)
        {
            wheelRepository = repository;
        }

        public async Task Create(WheelCreateModel newWheel)
        {
            var createdWheel = new Wheel()
            {
                Id = Utilities.GetGUID(),
                Width = newWheel.Width,
                Diameter = newWheel.Diameter,
                BoltPattern = newWheel.BoltPattern,
                Weight = newWheel.Weight,
                Material = newWheel.Material,
                Price = newWheel.Price
            };

            await wheelRepository.Create(createdWheel);
        }

        public async Task<int> Delete(string id)
        {
            var foundWheel = await wheelRepository.GetById(id);

            ///404 not found
            if (foundWheel == null)
                return -1;

            await wheelRepository.Delete(foundWheel);
            return 0;
        }

        public async Task<List<WheelModel>> GetAll()
        {
            var wheels = await Task.FromResult(
                (await wheelRepository.GetAll())
                .Select(x => new WheelModel(x)).ToList());

            return wheels;
        }

        public async Task<WheelModel> GetById(string id)
        {
            var wheel = await wheelRepository.GetById(id);

            //404 not found
            if (wheel == null)
                return null;

            var foundWheel = new WheelModel(wheel);
            return foundWheel;
        }

        public async Task<int> Update(string id, WheelCreateModel updatedWheel)
        {
            var wheel = await wheelRepository.GetById(id);

            //404 not found
            if (wheel == null)
                return -1;

            wheel.Weight = updatedWheel.Weight;
            wheel.Diameter = updatedWheel.Diameter;
            wheel.BoltPattern = updatedWheel.BoltPattern;
            wheel.Weight = updatedWheel.Weight;
            wheel.Material = updatedWheel.Material;
            wheel.Price = updatedWheel.Price;

            await wheelRepository.Update(wheel);
            return 0;
        }
    }
}
