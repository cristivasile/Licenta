using API.Context;
using API.Entities;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class AuthenticationManager : IAuthenticationManager
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly ITokenManager tokenManager;
        private readonly AppDbContext storage;

        public AuthenticationManager(UserManager<User> uManager, SignInManager<User> sManager, ITokenManager tManager, AppDbContext context)
        {
            userManager = uManager;
            signInManager = sManager;
            tokenManager = tManager;
            storage = context;
        }

        /// <returns>
        /// token for success
        /// -1 for inexistent email
        /// -2 too many logins, user is locked out
        /// -3 incorrect password
        /// </returns>
        public async Task<TokenModel> Login(LoginModel login)
        {
            var result = new TokenModel();

            var user = await userManager.FindByNameAsync(login.Username);

            if (user == null)
            {
                result.AccessToken = "-1";
                return result;
            }

            var tryLogin = await signInManager.CheckPasswordSignInAsync(user, login.Password, true);

            if (tryLogin.IsLockedOut)
            {
                result.AccessToken = "-2";
                return result;
            }

            if (!tryLogin.Succeeded)
            {
                result.AccessToken = "-3";
                return result;
            }

            var token = await tokenManager.GenerateToken(user);

            result.AccessToken = token;

            var roles = await userManager.GetRolesAsync(user);

            if (roles.Count == 1)
                result.Role = "User";
            else if (roles.Count == 2)
                result.Role = "Admin";
            else result.Role = "Sysadmin";

            return result;
        }


        /// <returns>
        /// 0 for success
        /// -1 for failure
        /// </returns>
        public async Task<IdentityResult> SignUp(RegisterModel newUser, List<string> roles)
        {
            var result = new IdentityResult();

            var user = new User()
            {
                Email = newUser.Email,
                UserName = newUser.Username
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
            {
                result = GenerateError("0002", "Invalid email!");
                return result;
            }

            //check if email already exists
            var emailExists = storage.Users.Any(x => x.Email.ToLower() == newUser.Email.ToLower());

            if (emailExists)
            {
                result = GenerateError("0001", "Email already exists!");
                return result;
            }

            if (user.UserName.Length < 6)
            {
                result = GenerateError("0003", "Username must have at least 6 characters!");
                return result;
            }
            if (user.UserName.Length > 14)
            {
                result = GenerateError("0004", "Username must have less than 15 characters!");
                return result;
            }

            if (newUser.Password.Length == 0)
            {
                result = GenerateError("0005", "Password field can not be empty!");
                return result;
            }

            result = await userManager.CreateAsync(user, newUser.Password);

            if (!result.Succeeded)
                return result;

            foreach (string role in roles)
                await userManager.AddToRoleAsync(user, role);

            return result;
        }

        //creates a custom error result
        private static IdentityResult GenerateError(string code, string error)
        {
            return IdentityResult.Failed(new IdentityError[] {
                                                new IdentityError {
                                                    Code = code,
                                                    Description = error
                                                }});
        }

    }
}
