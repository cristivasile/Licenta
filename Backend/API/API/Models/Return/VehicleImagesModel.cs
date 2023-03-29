using System.Collections.Generic;

namespace API.Models.Return
{
    public class VehicleImagesModel
    {
        public List<string> Images { get; set; }

        public VehicleImagesModel(List<string> images)
        {
            Images = images;
        }
    }
}
