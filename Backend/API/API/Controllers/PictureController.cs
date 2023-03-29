using API.Interfaces.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> ReadLocations([FromRoute] string vehicleId)
        {
            var locations = await pictureManager.GetByVehicleId(vehicleId);
            return Ok(locations);
        }
    }
}
