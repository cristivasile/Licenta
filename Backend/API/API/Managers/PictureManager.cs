using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class PictureManager : IPictureManager
    {
        private readonly IPictureRepository pictureRepository;

        public PictureManager(IPictureRepository pictureRepository)
        {
            this.pictureRepository = pictureRepository;
        }

        public async Task<List<string>> GetByVehicleId(string vehicleId)
        {
            var images = await pictureRepository.GetByVehicleId(vehicleId);

            return images.Select(x => x.Base64Image).ToList();
        }
    }
}
