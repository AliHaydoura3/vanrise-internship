using Microsoft.AspNetCore.Mvc;
using DeviceInventory.Models;
using DeviceInventory.Data;
using System.Collections.Generic;

namespace DeviceInventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhoneNumbersController : ControllerBase
    {
        private readonly IPhoneNumberRepository _repo;

        public PhoneNumbersController(IPhoneNumberRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public ActionResult<IEnumerable<PhoneNumberDTO>> GetPhoneNumbers([FromQuery] string? number = null, [FromQuery] int? deviceId = null)
        {
            var results = _repo.GetPhoneNumbers(number, deviceId);
            return Ok(results);
        }

        [HttpGet("{id}")]
        public ActionResult<PhoneNumber> GetPhoneNumber(int id)
        {
            var phoneNumber = _repo.GetPhoneNumber(id);
            if (phoneNumber == null) return NotFound();
            return Ok(phoneNumber);
        }

        [HttpPost]
        public ActionResult<PhoneNumber> CreatePhoneNumber([FromBody] PhoneNumber phoneNumber)
        {
            if (phoneNumber == null || string.IsNullOrWhiteSpace(phoneNumber.Number))
                return BadRequest("Number is required.");

            var created = _repo.CreatePhoneNumber(phoneNumber);
            return CreatedAtAction(nameof(GetPhoneNumber), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public ActionResult UpdatePhoneNumber(int id, [FromBody] PhoneNumber updated)
        {
            if (updated == null || string.IsNullOrWhiteSpace(updated.Number))
                return BadRequest("Number is required.");

            var ok = _repo.UpdatePhoneNumber(id, updated);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeletePhoneNumber(int id)
        {
            var ok = _repo.DeletePhoneNumber(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}
