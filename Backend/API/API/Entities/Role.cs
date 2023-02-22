using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace API.Entities
{
    public class Role : IdentityRole
    {
        public Role() : base() { }
        public Role(string role) : base(role) {}
    }
}
