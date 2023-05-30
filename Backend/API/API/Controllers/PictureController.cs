using API.Interfaces.Managers;
using API.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PictureController : ControllerBase
    {
        private readonly IPictureManager pictureManager;

        public PictureController(IPictureManager manager)
        {
            pictureManager = manager;
        }

        [HttpGet("getVehicleImages/{vehicleId}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadVehicleImages([FromRoute] string vehicleId)
        {
            var locations = await pictureManager.GetByVehicleId(vehicleId);
            return Ok(locations);
        }

        [HttpPut("updateImages/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateVehicleImages([FromRoute] string id, [FromBody] List<string> newImages)
        {
            try
            {
                await pictureManager.UpdateImages(id, newImages);
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
