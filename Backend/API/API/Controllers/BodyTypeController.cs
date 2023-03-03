using API.Interfaces.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/Vehicle-type")]
    [ApiController]
    public class BodyTypeController : ControllerBase
    {
        private readonly IBodyTypeManager bodyTypeManager;

        public BodyTypeController(IBodyTypeManager manager)
        {
            bodyTypeManager = manager;
        }

        [HttpGet("getAll")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadBodyTypes()
        {
            var vehicleTypes = await bodyTypeManager.GetAll();
            return Ok(vehicleTypes);
        }

        [HttpGet("getDictionary")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadVehicleTypesDictionary()
        {
            var vehicleTypesDictionary = await bodyTypeManager.GetBrandModelDictionary();
            return Ok(vehicleTypesDictionary);
        }

        [HttpDelete("{typeName}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteBodyType([FromRoute] string typeName)
        {
            try
            {
                await bodyTypeManager.Delete(typeName);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }
    }
}
