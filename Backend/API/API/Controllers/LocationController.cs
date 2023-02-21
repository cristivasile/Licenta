using API.Interfaces;
using API.Models;
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
            if(await locationManager.GetByAddress(newLocation.Address) != null)
            {
                return BadRequest("Location already exists!");
            }
            await locationManager.Create(newLocation);
            return Ok();
        }


        [HttpPut("{address}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateLocation([FromRoute] string address, [FromBody] LocationCreateModel updatedLocation)
        {
            if (await locationManager.Update(address, updatedLocation) == -1)
                return NotFound();

            return Ok();
        }

        [HttpDelete("{address}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteLocation([FromRoute] string address)
        {
            if (await locationManager.Delete(address) == -1)
                return NotFound();

            return Ok();
        }

    }
}
