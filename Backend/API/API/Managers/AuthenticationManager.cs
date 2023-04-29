using API.Context;
using API.Entities;
using API.Helpers;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using API.Models.Input;
using API.Models.Return;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class AuthenticationManager : IAuthenticationManager
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IAuthenticationTokenManager authTokenManager;
        private readonly IConfirmationTokenManager confirmationTokenManager;
        private readonly IEmailManager emailManager;
        private readonly IUserDetailsRepository userDetailsRepository;
        private readonly int passwordResetTokenExpiry = 15; //password reset token expiration in minutes

        public AuthenticationManager(UserManager<User> userManager, SignInManager<User> signInManager, IAuthenticationTokenManager authTokenManager,
            IConfirmationTokenManager confirmationTokenManager, IEmailManager emailManager, IUserDetailsRepository userDetailsRepository)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.authTokenManager = authTokenManager;
            this.confirmationTokenManager = confirmationTokenManager;
            this.emailManager = emailManager;
            this.userDetailsRepository = userDetailsRepository;
        }

        public async Task<List<string>> GetUsernames()
        {
            return await userManager.Users.Select(u => u.UserName).OrderBy(u => u).ToListAsync();
        }

        public async Task<LoginReturnModel> Login(LoginModel login)
        {
            var user = await userManager.FindByNameAsync(login.Username) ?? throw new Exception("User does not exist");

            if (!user.EmailConfirmed)
                throw new Exception("Please confirm your email first!");

            var tryLogin = await signInManager.CheckPasswordSignInAsync(user, login.Password, true);

            if (tryLogin.IsLockedOut)
                throw new Exception("User is locked out!");

            if (!tryLogin.Succeeded)
                throw new Exception("Incorrect password!");

            var token = await authTokenManager.GenerateToken(user);
            var roles = await userManager.GetRolesAsync(user);
            var userDetails = await userDetailsRepository.GetByUserId(user.Id);

            var result = new LoginReturnModel()
            {
                AccessToken = token,
                HasRecommendations = userDetails != null,
            };

            if (roles.Contains("Sysadmin"))
                result.Role = "Sysadmin";
            else if (roles.Contains("Admin"))
                result.Role = "Admin";
            else if (roles.Contains("User"))
                result.Role = "User";
            else
                throw new Exception("User has no roles!");

            return result;
        }

        public async Task SignUp(UserCreateModel newUser, List<string> roles)
        {
            var result = new IdentityResult();

            var newUserId = Utilities.GetGUID();

            var user = new User()
            {
                Id = newUserId,
                Email = newUser.Email,
                UserName = newUser.Username,
                EmailConfirmed = false
            };

            //check if email is valid

            bool emailValid = false;

            //check for email@email.

            int nrAts = user.Email.Count(x => x == '@');

            //check for email@email@email, email or email@.
            if (nrAts == 1 && user.Email[^1] != '.')
                for (var index = 0; index < user.Email.Length - 3; index++)
                {
                    //check for point after @ and at least one character
                    if(user.Email[index] == '@' && user.Email[index + 1] != '.')
                    {
                        //look for at least one . after @
                        for(var index2 = index + 2; index2 < user.Email.Length - 1; index2 ++)
                            if(user.Email[index2] == '.')
                            {
                                emailValid = true;
                                break;
                            }
                        break;
                    }
                }

            if(user.Email.Length > 50)
                emailValid = false;

            if (!emailValid)
                throw new Exception("Invalid email!");

            //check if email already exists
            var userEmailCheck = await userManager.FindByEmailAsync(user.Email);

            if (userEmailCheck != null)
            {
                if (userEmailCheck.EmailConfirmed)
                    throw new Exception("Email already exists!");
                else
                    await userManager.DeleteAsync(userEmailCheck);    //email not yet confirmed, delete
            }

            var userCheck = await userManager.FindByNameAsync(user.UserName);

            if(userCheck != null)
            {
                if (userCheck.EmailConfirmed)
                    throw new Exception("User already exists!");
                else
                    await userManager.DeleteAsync(userCheck);  //email not yet confirmed, delete
            }

            if (user.UserName.Length < 6)
                throw new Exception("Username must have at least 6 characters!");

            if (user.UserName.Length > 14)
                throw new Exception("Username must have less than 15 characters!");

            if (newUser.Password.Length == 0)
                throw new Exception("Password field can not be empty!");

            result = await userManager.CreateAsync(user, newUser.Password);

            if (!result.Succeeded)
                throw new Exception(string.Join("\n", result.Errors.Select(x => x.Description)));

            foreach (var role in roles)
                await userManager.AddToRoleAsync(user, role);

            //send the confirmation email
            var emailConfirmationToken = await confirmationTokenManager.Create(newUserId, ConfirmationTokenTypeEnum.EmailConfirmation);

            var confirmationEmailBody = "Hello,<br><br>To confirm your email address, please click the link: <a href='" 
                + $"{newUser.WebsiteConfirmationPageLink + emailConfirmationToken.Token}'>Confirm</a>";

            _ = emailManager.SendEmail(newUser.Email, "Confirm your email address", confirmationEmailBody);

            //create an UserDetails entry
            if (newUser.UserDetails != null)
            {
                var details = new UserDetails {
                    UserId = newUserId,
                    AgeGroup = newUser.UserDetails.AgeGroup,
                    Region = newUser.UserDetails.Region,
                    Sex = newUser.UserDetails.Sex,
                };

                await userDetailsRepository.Create(details);
            }
        }

        public async Task<string> ConfirmEmail(string tkn)
        {
            var token = await confirmationTokenManager.GetByToken(tkn);

            if (token == null)
                throw new KeyNotFoundException();
            else if (token.Type != ConfirmationTokenTypeEnum.EmailConfirmation)
                throw new Exception("Incorrect token type!");

            var user = await userManager.FindByIdAsync(token.UserId) ?? throw new Exception("User no longer exists!");
            await confirmationTokenManager.Delete(tkn);

            user.EmailConfirmed = true;
            await userManager.UpdateAsync(user);

            return user.UserName;
        }

        public async Task RequestPasswordReset(PasswordResetRequestModel request)
        {
            var user = await userManager.FindByNameAsync(request.Username) ?? throw new Exception("User does not exist!");

            if (user.Email != request.Email)
                throw new Exception("Incorrect email!");

            var tokens = await confirmationTokenManager.GetByUserId(user.Id);

            if (tokens.Any(x => x.Type == ConfirmationTokenTypeEnum.PasswordChange && x.CreationTime.AddMinutes(passwordResetTokenExpiry) > DateTime.Now))
                throw new Exception($"A reset email has already been sent in the last {passwordResetTokenExpiry} minutes");

            var passwordResetToken = await confirmationTokenManager.Create(user.Id, ConfirmationTokenTypeEnum.PasswordChange);

            var passwordResetEmailBody = $"Hello {request.Username},<br><br>To reset your password, please click the link: <a href='{ 
                request.WebsiteResetPasswordLink + user.UserName + '/' + passwordResetToken.Token }" +
                $"'>Reset</a><br>This link is valid for {passwordResetTokenExpiry} minutes.<br>If you did not request a password change, ignore this email.";

            await emailManager.SendEmail(user.Email, "Password reset request", passwordResetEmailBody);
        }

        public async Task ResetPassword(PasswordResetModel passwordReset)
        {
            var user = await userManager.FindByNameAsync(passwordReset.Username) ?? throw new Exception("User does not exist!");

            var token = await confirmationTokenManager.GetByToken(passwordReset.Token);

            if (token == null || token.UserId != user.Id)
                throw new Exception("Invalid token!");

            if (token.CreationTime.AddMinutes(passwordResetTokenExpiry) < DateTime.Now)
                throw new Exception("The token has expired! Send another reset request!");

            string resetToken = await userManager.GeneratePasswordResetTokenAsync(user);    //create a new Identity token and use it immediately
            var result = await userManager.ResetPasswordAsync(user, resetToken, passwordReset.NewPassword);

            if (!result.Succeeded)
                throw new Exception(string.Join("\n", result.Errors.Select(x => x.Description)));

            //delete spent token
            await confirmationTokenManager.Delete(token.Token);
        }
    }
}
