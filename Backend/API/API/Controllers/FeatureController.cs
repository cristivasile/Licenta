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
            var location = await featureManager.GetById(id);
            if (location == null)
                return NotFound();
            return Ok(location);
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateFeature([FromBody] FeatureCreateModel newFeature)
        {
            await featureManager.Create(newFeature);
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateFeature([FromRoute] string id, [FromBody] FeatureCreateModel updatedFeature)
        {
            if (await featureManager.Update(id, updatedFeature) == -1)
                return NotFound();

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteFeature([FromRoute] string id)
        {
            if (await featureManager.Delete(id) == -1)
                return NotFound();

            return Ok();
        }
    }
}
