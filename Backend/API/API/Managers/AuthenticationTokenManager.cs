using API.Entities;
using API.Interfaces.Managers;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Managers
{
    public class AuthenticationTokenManager : IAuthenticationTokenManager
    {
        private readonly IConfiguration config;
        private readonly UserManager<User> userManager;
        private readonly int tokenExpirationInMinutes = 60;

        public AuthenticationTokenManager(IConfiguration config, UserManager<User> manager)
        {
            this.config = config;
            userManager = manager;
        }

        public async Task<string> GenerateToken(User user)
        {
            var roles = await userManager.GetRolesAsync(user);
            var claims = new List<Claim>();

            foreach(var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
                claims.Add(new Claim(ClaimTypes.Name, user.UserName));
            }

            var secretKey = config.GetSection("Jwt").GetSection("Token").Get<string>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
             
            var tokenDescription = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(tokenExpirationInMinutes),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescription);

            return tokenHandler.WriteToken(token);
        }
    }
}
