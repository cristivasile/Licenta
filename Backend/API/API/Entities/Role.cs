using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class Role : IdentityRole
    {
        public Role() : base() { }
        public Role(string role) : base(role) {}
    }
}
