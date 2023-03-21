using API.Interfaces.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/Vehicle-type")]
    [ApiController]
    public class VehicleTypeController : ControllerBase
    {
        private readonly IVehicleTypeManager vehicleTypesManager;

        public VehicleTypeController(IVehicleTypeManager manager)
        {
            vehicleTypesManager = manager;
        }

        [HttpGet("getAll")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadVehicleTypes()
        {
            var vehicleTypes = await vehicleTypesManager.GetAll();
            return Ok(vehicleTypes);
        }

        [HttpGet("getDictionary")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadVehicleTypesDictionary()
        {
            var vehicleTypesDictionary = await vehicleTypesManager.GetBrandModelDictionary();
            return Ok(vehicleTypesDictionary);
        }

        [HttpDelete("delete")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteVehicleType([FromBody] VehicleTypeDeleteModel toDelete)
        {
            try
            {
                await vehicleTypesManager.Delete(toDelete);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }
    }
}
