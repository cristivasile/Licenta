using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Thumbnail: Entity
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string Base64Image { get; set; }

        [Required]
        public string VehicleId { get; set; }
        public virtual Vehicle Vehicle { get; set; }
    }
}
