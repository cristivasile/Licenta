using API.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IAuthenticationManager
    {

        /// <returns>
        /// 0 for success
        /// -1 for failure
        /// </returns>
        Task<IdentityResult> SignUp (RegisterModel newUser, List<string> roles);
        /// <returns>
        /// 0 for success
        /// -1 for inexistent email
        /// -2 too many logins, user is locked out
        /// -3 incorrect password
        /// </returns>
        Task<TokenModel> Login (LoginModel login);
    }
}
