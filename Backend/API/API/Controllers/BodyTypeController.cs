using API.Interfaces.Managers;
using API.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/Body-type")]
    [ApiController]
    public class BodyTypeController : ControllerBase
    {
        private readonly IBodyTypeManager bodyTypeManager;

        public BodyTypeController(IBodyTypeManager manager)
        {
            bodyTypeManager = manager;
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateBodyType([FromBody] BodyTypeCreateModel bodyType)
        {
            try
            {
                await bodyTypeManager.Create(bodyType);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> ReadBodyTypes()
        {
            var vehicleTypes = await bodyTypeManager.GetAll();
            return Ok(vehicleTypes);
        }

        [HttpDelete("{typeName}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteBodyType([FromRoute] string typeName)
        {
            try
            {
                await bodyTypeManager.Delete(typeName);
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
    }
}
