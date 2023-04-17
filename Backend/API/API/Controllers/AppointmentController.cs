using API.Interfaces.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentTypeManager appointmentTypeManager;

        public AppointmentController(IAppointmentTypeManager appointmentTypeManager)
        {
            this.appointmentTypeManager = appointmentTypeManager;
        }

        [HttpGet("types/{locationId}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadTypesByLocationId([FromRoute] string locationId)
        {
            var locations = await appointmentTypeManager.GetByLocationId(locationId);
            return Ok(locations);
        }

        [HttpPost("types")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateType([FromBody] AppointmentTypeCreateModel newAppointmentType)
        {
            try
            {
                await appointmentTypeManager.Create(newAppointmentType);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("types/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateType([FromRoute] string id, [FromBody] AppointmentTypeCreateModel updatedAppointmentType)
        {
            try
            {
                await appointmentTypeManager.Update(id, updatedAppointmentType);
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

        [HttpDelete("types/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteType([FromRoute] string id)
        {
            try
            {
                await appointmentTypeManager.Delete(id);
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
