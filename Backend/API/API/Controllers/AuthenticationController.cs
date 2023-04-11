using API.Interfaces.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
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
            try
            {
                await authenticationManager.SignUp(newUser, new List<string> { "User" });
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("signUpAdmin")]
        [Authorize(Policy = "Sysadmin")]
        public async Task<IActionResult> CreateAdmin([FromBody] RegisterModel newUser)
        {
            try
            {
                await authenticationManager.SignUp(newUser, new List<string> { "User", "Admin" });
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            try
            {
                var result = await authenticationManager.Login(login);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getUsernames")]
        [Authorize(Policy = "Admin")]

        public async Task<IActionResult> GetUsernames()
        {
            try
            {
                var result = await authenticationManager.GetUsernames();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
