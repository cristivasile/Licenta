using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Status : Entity
    {
        public string VehicleId { get; set; }
        public bool IsSold { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime? DateSold { get; set; }
        public string? PurchaserUserId { get; set; }
        public virtual User PurchasedBy { get; set; }
        public virtual Vehicle Vehicle { get; set; }
    }
}
