using API.Interfaces.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using API.Models.Return;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.Linq;
using System.Security.Claims;
using API.Entities;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentTypeManager appointmentTypeManager;
        private readonly IAppointmentManager appointmentManager;

        public AppointmentController(IAppointmentTypeManager appointmentTypeManager, IAppointmentManager appointmentManager)
        {
            this.appointmentTypeManager = appointmentTypeManager;
            this.appointmentManager = appointmentManager;
        }

        [HttpGet("appointmentsByLocationId/{locationId}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAppointmentsByLocationId([FromRoute] string locationId)
        {
            try
            {
                var appointments = await appointmentManager.GetAllByLocationId(locationId, upcoming: true);
                return Ok(appointments);
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

        [HttpGet("all/appointmentsByLocationId/{locationId}/{upcoming}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadAllAppointmentsByLocationId([FromRoute] string locationId, [FromRoute] bool upcoming)
        {
            try
            {
                var appointments = await appointmentManager.GetAllByLocationId(locationId, upcoming);
                return Ok(appointments);
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

        [HttpGet("appointmentByVehicle/{vehicleId}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAppointmentByVehicleId([FromRoute] string vehicleId)
        {
            var username = User.Identity.Name;

            if(username != null)
                try
                {
                    var appointments = await appointmentManager.GetByUserAndVehicleId(new() 
                                        { Username = username, VehicleId = vehicleId}, upcoming: true);
                    return Ok(appointments);
                }
                catch (KeyNotFoundException)
                {
                    return NotFound();
                }
                catch(Exception ex)
                {
                    return BadRequest(ex.Message);
                }

            return Unauthorized();
        }

        [HttpPost("appointmentByUserAndVehicleId")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadAppointmentByUserAndVehicleId([FromBody] AppointmentUserRequestModel request)
        {
            try
            {
                var appointments = await appointmentManager.GetByUserAndVehicleId(request, upcoming: true);
                return Ok(appointments);
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

        [HttpPost("availableIntervals")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAvailableIntervals([FromBody] AppointmentIntervalsRequestModel request)
        {
            try
            {
                var appointments = await appointmentManager.GetAvailableAppointmentTimes(request);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("appointments")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentCreateModel newAppointment)
        {
            var username = User.Identity.Name;

            if (username != null)
            {
                try
                {
                    await appointmentManager.Create(newAppointment, username);
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return Unauthorized();
        }

        [HttpDelete("appointments/{id}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> DeleteAppointment([FromRoute] string id)
        {
            var username = User.Identity.Name;

            if (username != null)
                try
                {
                    var appointments = await appointmentManager.GetAllByUsername(username);

                    if (!appointments.Any(x => x.Username == username))
                        throw new Exception("Appointment does not belong to this user!");

                    await appointmentManager.Delete(id);

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

            return Unauthorized();
        }

        [HttpDelete("appointments/admin/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteAppointmentAdmin([FromRoute] string id)
        {
            try
            {
                await appointmentManager.Delete(id);
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

        [HttpGet("types/{locationId}")]
        [Authorize(Policy = "User")]
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
