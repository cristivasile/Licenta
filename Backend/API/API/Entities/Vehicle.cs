using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PowerTrainTypeEnum : byte
    {
        Diesel = 0,
        Petrol = 1,
        LPG = 2,            //LPG + petrol
        HydrogenCell = 3,   //FCEV - fuel cell electric vehicle
        FullElectric = 4,   //BEV - battery electric vehicle
        Hybrid = 5,         //HEV
        PlugInHybrid = 6,   //PHEV 
        MildHybrid = 7      //MHEV
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum DriveTrainTypeEnum : byte
    {
        FWD = 0,
        RWD = 1,
        AWD = 2,
        FourWD = 3      //4WD, 4x4
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum TransmissionEnum : byte
    {
        Manual = 0,
        Semi_automatic = 1,
        Automatic = 2,
    }

    public class Vehicle : Entity
    {
        [Key]
        public string Id { get; set; }
        public string Description { get; set; }
        [Required]
        public string Image { get; set; }
        [Required]
        public string ThumbnailImage { get; set; }
        [Required]
        public int Odometer { get; set; }
        [Required]
        public int Year { get; set; }
        public int? EngineSize { get; set; }
        [Required]
        public int Power { get; set; }
        [Required]
        public int Torque { get; set; }
        [Required]
        public float Price { get; set; }
        [Required]
        public PowerTrainTypeEnum PowerTrainType { get; set; }
        [Required]
        public DriveTrainTypeEnum DriveTrainType { get; set; }
        [Required]
        public TransmissionEnum TransmissionType { get; set; }

        public virtual Status Status { get; set; }
        /// <summary>
        /// All features belonging to this vehicle.
        /// </summary>
        public virtual ICollection<Feature> Features { get; set; }

        public string Brand { get; set; }
        public string Model { get; set; }
        public virtual VehicleType VehicleType { get; set; }

        public string LocationId { get; set; }
        public virtual Location Location { get; set; }

        public string BodyTypeName { get; set; }
        public virtual BodyType BodyType { get; set; }
    }
}

