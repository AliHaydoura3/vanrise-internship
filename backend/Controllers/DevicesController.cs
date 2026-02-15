using Microsoft.AspNetCore.Mvc;
using DeviceInventory.Models;
using DeviceInventory.Data;
using System.Collections.Generic;

namespace DeviceInventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DevicesController : ControllerBase
    {
        private readonly IDeviceRepository _repo;

        public DevicesController(IDeviceRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Device>> GetDevices([FromQuery] string? name = null)
        {
            var results = _repo.GetDevices(name);
            return Ok(results);
        }

        [HttpGet("{id}")]
        public ActionResult<Device> GetDevice(int id)
        {
            var device = _repo.GetDevice(id);
            if (device == null) return NotFound();
            return Ok(device);
        }

        [HttpPost]
        public ActionResult<Device> CreateDevice([FromBody] Device device)
        {
            if (device == null || string.IsNullOrWhiteSpace(device.Name)) return BadRequest("Name is required.");

            var created = _repo.CreateDevice(device);
            return CreatedAtAction(nameof(GetDevice), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateDevice(int id, [FromBody] Device updated)
        {
            if (updated == null || string.IsNullOrWhiteSpace(updated.Name)) return BadRequest("Name is required.");

            var ok = _repo.UpdateDevice(id, updated);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteDevice(int id)
        {
            var ok = _repo.DeleteDevice(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
