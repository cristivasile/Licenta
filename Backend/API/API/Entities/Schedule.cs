using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum WeekdayEnum { 
        Monday = 0,
        Tuesday = 1,
        Wednesday = 2,
        Thursday = 3,
        Friday = 4,
        Saturday = 5,
        Sunday = 6
    }

    [PrimaryKey(nameof(LocationId), nameof(Weekday))]
    public class Schedule: Entity
    {
        [Required]
        public WeekdayEnum Weekday { get; set; }
        [Required]
        public TimeSpan OpeningTime { get; set; }
        [Required]
        public TimeSpan ClosingTime { get; set; }
        [Required]
        public string LocationId { get; set; }
        public virtual Location Location { get; set; }
    }
}
