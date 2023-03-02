using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
