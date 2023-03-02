using API.Interfaces.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILocationManager locationManager;

        public LocationController(ILocationManager manager)
        {
            locationManager = manager;
        }

        [HttpGet("getAll")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadLocations()
        {
            var locations = await locationManager.GetAll();
            return Ok(locations);
        }

        [HttpGet("{address}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadByAddress([FromRoute] string address)
        {
            var location = await locationManager.GetByAddress(address);
            if (location == null)
                return NotFound();
            return Ok(location);
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateLocation([FromBody] LocationCreateModel newLocation)
        {
            try
            {
                await locationManager.Create(newLocation);
                return Ok();
            }
            catch
            {
                return BadRequest("Location already exists! Update or delete it!");
            }
        }


        [HttpPut("{address}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateLocation([FromRoute] string address, [FromBody] LocationCreateModel updatedLocation)
        {
            try
            {
                await locationManager.Update(address, updatedLocation);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpDelete("{address}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteLocation([FromRoute] string address)
        {
            try
            {
                await locationManager.Delete(address);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

    }
}
