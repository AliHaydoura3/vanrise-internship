using Microsoft.AspNetCore.Mvc;
using DeviceInventory.Models;
using DeviceInventory.Data;
using System.Collections.Generic;

namespace DeviceInventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly IClientRepository _repo;

        public ClientsController(IClientRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Client>> GetClients([FromQuery] string? name = null, [FromQuery] int? type = null)
        {
            var results = _repo.GetClients(name, type);
            return Ok(results);
        }

        [HttpGet("{id}")]
        public ActionResult<Client> GetClient(int id)
        {
            var client = _repo.GetClient(id);
            if (client == null) return NotFound();
            return Ok(client);
        }

        [HttpPost]
        public ActionResult<Client> CreateClient([FromBody] Client client)
        {
            if (client == null || string.IsNullOrWhiteSpace(client.Name)) return BadRequest("Name is required.");
            if (client.Type == ClientType.Individual && client.BirthDate == null)
                return BadRequest("BirthDate is required for individual clients.");

            var created = _repo.CreateClient(client);
            return CreatedAtAction(nameof(GetClient), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateClient(int id, [FromBody] Client updated)
        {
            if (updated == null || string.IsNullOrWhiteSpace(updated.Name)) return BadRequest("Name is required.");
            if (updated.Type == ClientType.Individual && updated.BirthDate == null)
                return BadRequest("BirthDate is required for individual clients.");

            var ok = _repo.UpdateClient(id, updated);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteClient(int id)
        {
            var ok = _repo.DeleteClient(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
