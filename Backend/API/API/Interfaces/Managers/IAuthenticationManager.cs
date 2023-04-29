using API.Models.Input;
using API.Models.Return;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces.Managers
{
    public interface IAuthenticationManager
    {
        Task<List<string>> GetUsernames();
        Task<LoginReturnModel> Login(LoginModel login);
        Task SignUp(UserCreateModel newUser, List<string> roles);
        /// <summary>
        /// If successful, returns the username for which the email was confirmed
        /// </summary>
        Task<string> ConfirmEmail(string token);
        Task RequestPasswordReset(PasswordResetRequestModel request);
        Task ResetPassword(PasswordResetModel passwordReset);
    }
}
