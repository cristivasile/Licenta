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

    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleManager vehicleManager;

        public VehicleController(IVehicleManager manager)
        {
            vehicleManager = manager;
        }
        
        [HttpPost("getAll")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadVehicles([FromBody] VehicleFiltersModel filters)
        {
            try
            {
                var vehicles = await vehicleManager.GetAll(filters);
                return Ok(vehicles);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private async Task<IActionResult> ReadAvailableCommon(VehicleFiltersModel filters)
        {
            try
            {
                var vehicles = await vehicleManager.GetAvailable(filters);
                return Ok(vehicles);
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

        /// <summary>
        /// Must be called by authenticated users in order to get recommendations
        /// Get all vehicles that have an associated "available" status. 
        /// For no filters send an empty {} body
        /// </summary>
        [HttpPost("getAvailable")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAvailableVehicles([FromBody] VehicleFiltersModel filters)
        {
            try 
            {
                filters.Username = User.Identity.Name;
                return await ReadAvailableCommon(filters);
            }
            catch
            {
                return Unauthorized();
            }
        }

        /// <summary>
        /// Get all vehicles that have an associated "available" status. 
        /// For no filters send an empty {} body
        /// </summary>
        [HttpPost("getAvailable/noAuth")]
        public async Task<IActionResult> ReadAvailableVehiclesNoAuth([FromBody] VehicleFiltersModel filters) 
        { 
            return await ReadAvailableCommon(filters);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadById([FromRoute] string id)
        {
            var username = User.Identity.Name;

            if (username != null)
                try
                {
                    var vehicle = await vehicleManager.GetById(id, username);
                    return Ok(vehicle);
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

        [HttpGet("admin/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadByIdExtended([FromRoute] string id)
        {
            try
            {
                var vehicle = await vehicleManager.GetByIdExtended(id);
                return Ok(vehicle);
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

        [HttpGet("getBrandModelDictionary")]
        public async Task<IActionResult> ReadBrandModelDictionary()
        {
            var dict = await vehicleManager.GetBrandModelDictionary();
            return Ok(dict);
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateVehicle([FromBody] VehicleCreateModel vehicle)
        {
            try
            {
                await vehicleManager.Create(vehicle);
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        
        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateVehicle([FromRoute] string id, [FromBody] VehicleCreateModel updatedVehicle)
        {
            try
            {
                await vehicleManager.Update(id, updatedVehicle);
                return Ok();
            }
            catch(KeyNotFoundException)
            {
                return NotFound();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("setSold/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateVehicleStatus([FromRoute] string id, [FromBody] VehicleStatusUpdateModel newStatus)
        {
            try
            {
                await vehicleManager.UpdateStatus(id, newStatus);
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

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteVehicle([FromRoute] string id)
        {
            try
            {
                await vehicleManager.Delete(id);
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
