using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/auth")]
    [ApiController]

    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationManager authenticationManager;

        public AuthenticationController(IAuthenticationManager manager)
        {
            authenticationManager = manager;
        }

        [HttpPost("signUp")]
        public async Task<IActionResult> CreateUser([FromBody] RegisterModel newUser)
        {
            var result = await authenticationManager.SignUp(newUser, new List<string>{"User"});
            if(result.Succeeded)
                return Ok();

            var errorResult = "";

            foreach (string error in result.Errors.Select(x => x.Description))
                errorResult = errorResult + error + "\n";

            return BadRequest(errorResult);
        }

        [HttpPost("signUpAdmin")]
        [Authorize(Policy = "Sysadmin")]
        public async Task<IActionResult> CreateAdmin([FromBody] RegisterModel newUser)
        {
            var result = await authenticationManager.SignUp(newUser, new List<string> { "User", "Admin" });
            if (result.Succeeded)
                return Ok();

            var errorResult = "";

            foreach (string error in result.Errors.Select(x => x.Description))
                errorResult = errorResult + error + "\n";

            return BadRequest(errorResult);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var result = await authenticationManager.Login(login);



            if (result.AccessToken == "-1")
                return BadRequest("User does not exist!");

            if (result.AccessToken == "-2")
                return BadRequest("User is locked out!");

            if (result.AccessToken == "-3")
                return BadRequest("Incorrect password!");
            
            return Ok(result);
        }
    }
}
