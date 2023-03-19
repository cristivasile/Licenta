using API.Interfaces.Managers;
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
        public async Task<IActionResult> ReadVehicles([FromBody] VehiclePaginationModel filters)
        {
            var vehicles = await vehicleManager.GetAll(filters);
            return Ok(vehicles);
        }

        /// <summary>
        /// Get all vehicles that have an associated "available" status. 
        /// For no filters send an empty {} body
        /// </summary>
        [HttpPost("getAvailable")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAvailableVehicles([FromBody] VehicleFiltersModel filters)
        {
            var vehicles = await vehicleManager.GetAvailable(filters);
            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadById([FromRoute] string id)
        {
            var vehicle = await vehicleManager.GetById(id);

            if (vehicle == null)
                return NotFound();

            return Ok(vehicle);
        }

        [HttpGet("admin/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadByIdExtended([FromRoute] string id)
        {
            var vehicle = await vehicleManager.GetByIdExtended(id);

            if (vehicle == null)
                return NotFound();

            return Ok(vehicle);
        }

        [HttpGet("getBrandModelDictionary")]
        [Authorize(Policy = "User")]
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
        [Authorize(Policy = "User")]
        public async Task<IActionResult> UpdateVehicleStatus([FromRoute] string id, [FromBody] VehicleStatusUpdateModel newStatus)
        {
            try
            {
                await vehicleManager.UpdateStatus(id, newStatus);
                return Ok();
            }
            catch
            {
                return NotFound();
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
            catch
            {
                return NotFound();
            }
        }
    } 
}
