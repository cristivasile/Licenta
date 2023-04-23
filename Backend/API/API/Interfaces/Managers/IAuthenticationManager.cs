using API.Models;
using API.Models.Input;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IAuthenticationManager
    {
        Task<List<string>> GetUsernames();
        Task<TokenModel> Login(LoginModel login);
        Task SignUp(RegisterModel newUser, List<string> roles);
        /// <summary>
        /// If successful, returns the username for which the email was confirmed
        /// </summary>
        Task<string> ConfirmEmail(string token);
    }
}
