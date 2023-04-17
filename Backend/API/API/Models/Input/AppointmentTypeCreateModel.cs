using System.ComponentModel.DataAnnotations;

namespace API.Models.Input
{
    public class AppointmentTypeCreateModel
    {
        public string Name { get; set; }
        [Required]
        public uint Duration { get; set; }
        [Required]
        public string LocationId { get; set; }
    }
}
