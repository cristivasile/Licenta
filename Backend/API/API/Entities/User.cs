using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace API.Entities
{
    public class User : IdentityUser
    {
        public virtual ICollection<Status> PurchasedVehicleStatuses { get; set; }
    }
}
