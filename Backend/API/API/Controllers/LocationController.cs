using API.Interfaces.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
