using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WheelController : ControllerBase
    {
        private readonly IWheelManager wheelManager;

        public WheelController(IWheelManager manager)
        {
            wheelManager = manager;
        }

        [HttpGet("getAll")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ReadAll()
        {
            var wheels = await wheelManager.GetAll();
            return Ok(wheels);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadById([FromRoute] string id)
        {
            var wheel = await wheelManager.GetById(id);
            if (wheel == null)
                return NotFound();
            return Ok(wheel);
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateWheel([FromBody] WheelCreateModel newWheel)
        {
            await wheelManager.Create(newWheel);
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateWheel([FromRoute] string id, [FromBody] WheelCreateModel updatedWheel)
        {
            if (await wheelManager.Update(id, updatedWheel) == -1)
                return NotFound();

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteWheel([FromRoute] string id)
        {
            if (await wheelManager.Delete(id) == -1)
                return NotFound();

            return Ok();
        }
    }
}
