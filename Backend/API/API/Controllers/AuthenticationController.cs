    using API.Interfaces.Managers;
using API.Models.Input;
using Azure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
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
        public async Task<IActionResult> CreateUser([FromBody] UserCreateModel newUser)
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
        public async Task<IActionResult> CreateAdmin([FromBody] UserCreateModel newUser)
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

        [HttpPost("confirmEmail/{token}")]
        public async Task<IActionResult> ConfirmEmail([FromRoute] string token)
        {
            try
            {
                var username = await authenticationManager.ConfirmEmail(token);
                return Ok(username);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("passwordResetRequest")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequestModel passwordResetRequest)
        {
            try
            {
                await authenticationManager.RequestPasswordReset(passwordResetRequest);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("passwordReset")]
        public async Task<IActionResult> PasswordReset([FromBody] PasswordResetModel passwordReset)
        {
            try
            {
                await authenticationManager.ResetPassword(passwordReset);
                return Ok();
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
