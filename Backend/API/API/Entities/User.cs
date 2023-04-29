using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace API.Entities
{
    public class User : IdentityUser
    {
        public virtual ICollection<Status> PurchasedVehicleStatuses { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<ConfirmationToken> ConfirmationTokens { get; set; }
        public virtual ICollection<VehicleView> VehicleViews { get; set; }
        public virtual RecommendationDetails RecommendationDetails { get; set; }
    }
}
