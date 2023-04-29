using API.Entities;

namespace API.Models.Input
{
    public class UserDetailsCreateModel
    {
        public AgeGroup AgeGroup { get; set; }
        public Region Region { get; set; }
        public Sex Sex { get; set; }
    }
}
