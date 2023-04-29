using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Entities
{

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum AgeGroup
    {
        Young = 0,      //18 - 39
        Middle = 1,     //40 - 59
        Old = 2,        //60+
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Sex
    {
        Male = 0,   
        Female = 1,
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Region
    {
        Urban = 0,
        Rural = 1,
    }

    public class UserDetails : Entity
    {
        [Key]
        public string UserId { get; set; }
        
        [Required]
        public AgeGroup AgeGroup { get; set; }

        [Required]
        public Region Region { get; set; }

        [Required]
        public Sex Sex { get; set; }

        public virtual User User { get; set; }
    }
}
