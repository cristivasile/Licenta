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
        [Authorize(Policy = "Admin")]
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
                var id = await locationManager.Create(newLocation);
                return Ok(id);
            }
            catch
            {
                return BadRequest("Location already exists! Update or delete it!");
            }
        }


        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateLocation([FromRoute] string id, [FromBody] LocationCreateModel updatedLocation)
        {
            try
            {
                await locationManager.Update(id, updatedLocation);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteLocation([FromRoute] string id)
        {
            try
            {
                await locationManager.Delete(id);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

    }
}
