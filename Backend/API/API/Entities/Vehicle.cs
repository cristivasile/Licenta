using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PowerTrainType : byte
    {
        Diesel = 0,
        Petrol = 1,
        HydrogenCell = 2,   //FCEV - fuel cell electric vehicle
        FullElectric = 3,   //BEV - battery electric vehicle
        Hybrid = 4,         //HEV
        PlugInHybrid = 5,   //PHEV 
        MildHybrid = 6      //MHEV
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum DriveTrainType : byte
    {
        FWD = 0,
        RWD = 1,
        AWD = 2,
        FourWD = 3      //4WD, 4x4
    }


    public class Vehicle : Entity
    {
        [Key]
        public string Id { get; set; }
        public string Description { get; set; }
        [Required]
        public string Image { get; set; }
        [Required]
        public int Odometer { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public float EngineSize { get; set; }
        [Required]
        public int Power { get; set; }
        [Required]
        public float Price { get; set; }
        [Required]
        public PowerTrainType PowerTrainType { get; set; }
        [Required]
        public DriveTrainType DriveTrainType { get; set; }
        
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

