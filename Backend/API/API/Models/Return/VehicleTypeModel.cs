using API.Entities;

namespace API.Models.Return
{
    public class VehicleTypeModel
    {
        public string Brand { get; set; }
        public string Model { get; set; }

        public VehicleTypeModel(VehicleType x)
        {
            Brand = x.Brand;
            Model = x.Model;
        }
    }
}
