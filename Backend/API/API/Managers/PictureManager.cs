using API.Entities;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class PictureManager : IPictureManager
    {
        private readonly IPictureRepository pictureRepository;
        private static readonly int maxImageSize = 2621440; //2.5 MB in bytes

        public PictureManager(IPictureRepository pictureRepository)
        {
            this.pictureRepository = pictureRepository;
        }

        public async Task UpdateImages(string id, List<string> updatedImages)
        {
            //check images
            foreach (var image in updatedImages)
                if (image.Length > maxImageSize)
                    throw new Exception("An image is too large!");

            //remove new pictures
            var images = await pictureRepository.GetByVehicleId(id);
            foreach (var image in images)
                await pictureRepository.Delete(image);

            //add new pictures
            List<Picture> newImages = new();
            foreach (var image in updatedImages)
                newImages.Add(new()
                {
                    Id = Program.GetGUID(),
                    Base64Image = image,
                    VehicleId = id,
                });

            foreach (var newImage in newImages)
                await pictureRepository.Create(newImage);
        }

        public async Task<List<string>> GetByVehicleId(string vehicleId)
        {
            var images = await pictureRepository.GetByVehicleId(vehicleId);

            return images.Select(x => x.Base64Image).ToList();
        }
    }
}
