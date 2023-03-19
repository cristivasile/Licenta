using System.Text.Json.Serialization;

namespace API.Models.Input
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum FiltersSortType : byte
    {
        Name = 0,
        Price = 1,
        Mileage = 2,
        Power = 3,
    }

    public class VehicleFiltersModel : VehiclePaginationModel
    {
#nullable enable
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? BodyType { get; set; }
        public int? MaxMileage { get; set; }
        public int? MinPrice { get; set; }
        public int? MinPower { get; set; }
        public int? MaxPower { get; set; }
        public int? MaxPrice { get; set; }
        public int? MinYear { get; set; }
        public FiltersSortType? Sort { get; set; }
        public bool SortAsc { get; set; }
    }
}
