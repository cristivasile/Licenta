using API.Interfaces.Managers;
using API.Managers;
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
    public class FeatureController : ControllerBase
    {
        private readonly IFeatureManager featureManager;

        public FeatureController(IFeatureManager manager)
        {
            featureManager = manager;
        }

        [HttpGet("getAll")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadAll()
        {
            var locations = await featureManager.GetAll();
            return Ok(locations);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "User")]
        public async Task<IActionResult> ReadById([FromRoute] string id)
        {
            var location = await featureManager.GetByName(id);
            if (location == null)
                return NotFound();
            return Ok(location);
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateFeature([FromBody] FeatureCreateModel newFeature)
        {
            try
            {
                await featureManager.Create(newFeature);
                return Ok();
            }
            catch
            {
                return BadRequest("Location already exists! Update or delete it!");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateFeature([FromRoute] string id, [FromBody] FeatureCreateModel updatedFeature)
        {
            try
            {
                await featureManager.Update(id, updatedFeature);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteFeature([FromRoute] string id)
        {
            try
            {
                await featureManager.Delete(id);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }
    }
}
