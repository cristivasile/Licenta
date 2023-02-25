﻿using API.Interfaces;
using API.Models;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
            this.vehicleManager = manager;
        }
        
        [HttpGet("getAll")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadVehicles()
        {
            var vehicles = await vehicleManager.GetAll();
            return Ok(vehicles);
        }

        /// <summary>
        /// Get all vehicles that have an associated "available" status.
        /// </summary>
        [HttpGet("getAvailable")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAvailableVehicles()
        {
            var vehicles = await vehicleManager.GetAvailable();
            return Ok(vehicles);
        }

        // <summary>
        /// Get all vehicles that have an associated "available" status, filtered by name.
        /// </summary>
        [HttpPost("getAvailableByName")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAvailableVehiclesByName([FromBody] VehicleSearchModel filter)
        {
            var vehicles = await vehicleManager.GetAvailable(filter);
            return Ok(vehicles);
        }

        // <summary>
        /// Get all vehicles that have an associated "available" status, filtered by given criteria.
        /// </summary>
        [HttpPost("getAvailableFiltered")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAvailableVehiclesFiltered([FromBody] VehicleFiltersModel filters)
        {
            var vehicles = await vehicleManager.GetAvailableFiltered(filters);
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

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateVehicle([FromBody] VehicleCreateModel vehicle)
        {
            await vehicleManager.Create(vehicle);
            return Ok();
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
            catch
            {
                return NotFound();
            }
        }

        [HttpPut("setSold/{id}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> UpdateVehicleStatus([FromRoute] string id, [FromBody] VehicleUpdateStatusModel newStatus)
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
