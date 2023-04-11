using API.Models;
using API.Models.Input;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IAuthenticationManager
    {
        Task<IdentityResult> SignUp(RegisterModel newUser, List<string> roles);
        Task<TokenModel> Login(LoginModel login);
    }
}
