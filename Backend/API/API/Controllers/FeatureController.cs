﻿using API.Interfaces.Managers;
using API.Models.Input;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> CreateFeature([FromBody] FeatureCreateModel newFeature)
        {
            try
            {
                var id = await featureManager.Create(newFeature);
                return Ok(id);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
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
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch
            {
                return BadRequest("A feature with the given name already exists!");
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
