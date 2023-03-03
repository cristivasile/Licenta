using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Status : Entity
    {
        [Key]
        public string VehicleId { get; set; }
        [Required]
        public bool IsSold { get; set; }
        [Required]
        public DateTime DateAdded { get; set; }
        public DateTime? DateSold { get; set; }
#nullable enable
        public string? PurchaserUserId { get; set; }
#nullable disable
        public virtual User PurchasedBy { get; set; }
        public virtual Vehicle Vehicle { get; set; }
    }
}
