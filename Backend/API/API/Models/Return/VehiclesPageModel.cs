using System.Collections.Generic;

namespace API.Models.Return
{
    public class VehiclesPageModel
    {
        //total vehicles count, the list returned is just a page/slice
        public int TotalCount { get; set; }
        public List<VehicleModel> Vehicles { get; set; } = new List<VehicleModel>();
    }
}
